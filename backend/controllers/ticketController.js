const { Op } = require('sequelize');
const { Ticket, User, Official, AuditLog, Project } = require('../models');
const AppError = require('../utils/appError');
const { filterObj } = require('../utils/helpers');
const { uploadToS3 } = require('../services/fileUpload');
const { sendTicketCreatedEmail, sendTicketStatusUpdateEmail } = require('../services/emailService');

// Helper function to filter allowed fields for ticket updates
const filterTicketUpdate = (body) => {
  return filterObj(
    body,
    'title',
    'description',
    'category',
    'priority',
    'status',
    'location',
    'address',
    'projectId'
  );
};

// Get all tickets (with filtering, sorting, and pagination)
const getAllTickets = async (req, res, next) => {
  try {
    const {
      status,
      category,
      priority,
      assignedTo,
      createdBy,
      projectId,
      startDate,
      endDate,
      sort = '-createdAt',
      page = 1,
      limit = 10,
    } = req.query;

    // Build where clause
    const where = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (priority) where.priority = priority;
    if (assignedTo) where.assignedTo = assignedTo;
    if (createdBy) where.userId = createdBy;
    if (projectId) where.projectId = projectId;
    
    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    // If not admin, only show user's tickets or assigned tickets
    if (req.user.role !== 'admin') {
      where[Op.or] = [
        { userId: req.user.id },
        { assignedTo: req.user.official?.id || null },
      ];
    }

    // Execute query with pagination
    const offset = (page - 1) * limit;
    const { count, rows: tickets } = await Ticket.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'reporter',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'assignedOfficial',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: Official,
              attributes: ['position', 'department'],
            },
          ],
        },
        {
          model: Project,
          attributes: ['id', 'title'],
        },
      ],
      order: [sort.startsWith('-') ? [sort.slice(1), 'DESC'] : [sort, 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    res.status(200).json({
      status: 'success',
      results: tickets.length,
      data: {
        tickets,
        pagination: {
          total: count,
          totalPages,
          currentPage: parseInt(page),
          hasNextPage,
          hasPreviousPage,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get current user's tickets
const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.findAll({
      where: {
        [Op.or]: [
          { userId: req.user.id },
          { assignedTo: req.user.official?.id || null },
        ],
      },
      include: [
        {
          model: User,
          as: 'reporter',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'assignedOfficial',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: Official,
              attributes: ['position', 'department'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      status: 'success',
      results: tickets.length,
      data: {
        tickets,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create a new ticket
const createTicket = async (req, res, next) => {
  try {
    // Handle file uploads if any
    let mediaUrls = [];
    if (req.files && req.files.length > 0) {
      mediaUrls = await Promise.all(
        req.files.map(async (file) => {
          const result = await uploadToS3(file);
          return result.Location;
        })
      );
    }

    // Create ticket
    const ticketData = {
      ...req.body,
      userId: req.user.id,
      status: 'open',
      mediaUrls,
    };

    const ticket = await Ticket.create(ticketData);

    // Log the ticket creation
    await AuditLog.create({
      action: 'CREATE_TICKET',
      entityType: 'ticket',
      entityId: ticket.id,
      userId: req.user.id,
      metadata: {
        title: ticket.title,
        status: ticket.status,
      },
    });

    // Send email notification to admins/officials
    await sendTicketCreatedEmail(ticket, req.user);

    res.status(201).json({
      status: 'success',
      data: {
        ticket,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get a single ticket
const getTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'reporter',
          attributes: ['id', 'name', 'email', 'phone'],
        },
        {
          model: User,
          as: 'assignedOfficial',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: Official,
              attributes: ['position', 'department'],
            },
          ],
        },
        {
          model: Project,
          attributes: ['id', 'title'],
        },
      ],
    });

    if (!ticket) {
      return next(new AppError('No ticket found with that ID', 404));
    }

    // Check if user has permission to view this ticket
    if (
      req.user.role !== 'admin' &&
      ticket.userId !== req.user.id &&
      ticket.assignedTo !== (req.user.official?.id || null)
    ) {
      return next(
        new AppError('You do not have permission to view this ticket', 403)
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        ticket,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update a ticket
const updateTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);

    if (!ticket) {
      return next(new AppError('No ticket found with that ID', 404));
    }

    // Check permissions
    if (
      req.user.role !== 'admin' &&
      ticket.userId !== req.user.id &&
      ticket.assignedTo !== (req.user.official?.id || null)
    ) {
      return next(
        new AppError('You do not have permission to update this ticket', 403)
      );
    }

    // Handle file uploads if any
    let mediaUrls = [...(ticket.mediaUrls || [])];
    if (req.files && req.files.length > 0) {
      const newMediaUrls = await Promise.all(
        req.files.map(async (file) => {
          const result = await uploadToS3(file);
          return result.Location;
        })
      );
      mediaUrls = [...mediaUrls, ...newMediaUrls];
    }

    // Prepare update data
    const updateData = {
      ...filterTicketUpdate(req.body),
      mediaUrls,
    };

    // Only allow status changes for officials and admins
    if (req.body.status && req.user.role === 'citizen') {
      delete updateData.status;
    }

    // Update ticket
    const [_, [updatedTicket]] = await Ticket.update(updateData, {
      where: { id: req.params.id },
      returning: true,
    });

    // Log the update
    await AuditLog.create({
      action: 'UPDATE_TICKET',
      entityType: 'ticket',
      entityId: ticket.id,
      userId: req.user.id,
      metadata: {
        updatedFields: Object.keys(updateData),
        previousStatus: ticket.status,
        newStatus: updateData.status || ticket.status,
      },
    });

    // Send status update email if status changed
    if (req.body.status && req.body.status !== ticket.status) {
      await sendTicketStatusUpdateEmail(updatedTicket, ticket.status, req.user);
    }

    res.status(200).json({
      status: 'success',
      data: {
        ticket: updatedTicket,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete a ticket
const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);

    if (!ticket) {
      return next(new AppError('No ticket found with that ID', 404));
    }

    // Check permissions
    if (req.user.role !== 'admin' && ticket.userId !== req.user.id) {
      return next(
        new AppError('You do not have permission to delete this ticket', 403)
      );
    }

    // Log the deletion
    await AuditLog.create({
      action: 'DELETE_TICKET',
      entityType: 'ticket',
      entityId: ticket.id,
      userId: req.user.id,
      metadata: {
        title: ticket.title,
        status: ticket.status,
      },
    });

    // Soft delete the ticket
    await ticket.destroy();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// Update ticket status
const updateTicketStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findByPk(req.params.id);

    if (!ticket) {
      return next(new AppError('No ticket found with that ID', 404));
    }

    // Check permissions
    if (
      req.user.role !== 'admin' &&
      ticket.assignedTo !== (req.user.official?.id || null)
    ) {
      return next(
        new AppError(
          'You do not have permission to update the status of this ticket',
          403
        )
      );
    }

    const previousStatus = ticket.status;
    ticket.status = status;
    
    // Update timestamps based on status
    const now = new Date();
    if (status === 'in_progress' && previousStatus === 'open') {
      ticket.assignedAt = now;
    } else if (status === 'resolved' && previousStatus !== 'resolved') {
      ticket.resolvedAt = now;
    } else if (status === 'closed' && previousStatus !== 'closed') {
      ticket.closedAt = now;
    }

    await ticket.save();

    // Log the status update
    await AuditLog.create({
      action: 'UPDATE_TICKET_STATUS',
      entityType: 'ticket',
      entityId: ticket.id,
      userId: req.user.id,
      metadata: {
        previousStatus,
        newStatus: status,
      },
    });

    // Send status update email
    await sendTicketStatusUpdateEmail(ticket, previousStatus, req.user);

    res.status(200).json({
      status: 'success',
      data: {
        ticket,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Assign a ticket to an official
const assignTicket = async (req, res, next) => {
  try {
    const { officialId } = req.body;
    
    // Check if official exists and is active
    const official = await Official.findByPk(officialId, {
      include: [{ model: User, where: { isActive: true } }],
    });

    if (!official) {
      return next(new AppError('No active official found with that ID', 404));
    }

    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) {
      return next(new AppError('No ticket found with that ID', 404));
    }

    const previousOfficialId = ticket.assignedTo;
    ticket.assignedTo = officialId;
    ticket.status = 'in_progress';
    ticket.assignedAt = new Date();
    
    await ticket.save();

    // Log the assignment
    await AuditLog.create({
      action: 'ASSIGN_TICKET',
      entityType: 'ticket',
      entityId: ticket.id,
      userId: req.user.id,
      metadata: {
        previousOfficialId,
        newOfficialId: officialId,
      },
    });

    // TODO: Send notification to the assigned official

    res.status(200).json({
      status: 'success',
      data: {
        ticket,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get ticket comments
const getTicketComments = async (req, res, next) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              attributes: ['id', 'name', 'email', 'profileImage'],
            },
          ],
          order: [['createdAt', 'DESC']],
        },
      ],
    });

    if (!ticket) {
      return next(new AppError('No ticket found with that ID', 404));
    }

    // Check permissions
    if (
      req.user.role !== 'admin' &&
      ticket.userId !== req.user.id &&
      ticket.assignedTo !== (req.user.official?.id || null)
    ) {
      return next(
        new AppError('You do not have permission to view comments for this ticket', 403)
      );
    }

    res.status(200).json({
      status: 'success',
      results: ticket.comments.length,
      data: {
        comments: ticket.comments,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Add a comment to a ticket
const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const ticket = await Ticket.findByPk(req.params.id);

    if (!ticket) {
      return next(new AppError('No ticket found with that ID', 404));
    }

    // Check permissions
    if (
      req.user.role !== 'admin' &&
      ticket.userId !== req.user.id &&
      ticket.assignedTo !== (req.user.official?.id || null)
    ) {
      return next(
        new AppError('You do not have permission to comment on this ticket', 403)
      );
    }

    const comment = await Comment.create({
      content,
      ticketId: ticket.id,
      userId: req.user.id,
      isInternal: req.user.role !== 'citizen',
    });

    // Log the comment
    await AuditLog.create({
      action: 'ADD_COMMENT',
      entityType: 'ticket',
      entityId: ticket.id,
      userId: req.user.id,
      metadata: {
        commentId: comment.id,
        isInternal: comment.isInternal,
      },
    });

    // TODO: Send notification to relevant users

    res.status(201).json({
      status: 'success',
      data: {
        comment,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get ticket history/audit log
const getTicketHistory = async (req, res, next) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);

    if (!ticket) {
      return next(new AppError('No ticket found with that ID', 404));
    }

    // Check permissions
    if (
      req.user.role !== 'admin' &&
      ticket.userId !== req.user.id &&
      ticket.assignedTo !== (req.user.official?.id || null)
    ) {
      return next(
        new AppError('You do not have permission to view history for this ticket', 403)
      );
    }

    const history = await AuditLog.findAll({
      where: {
        entityType: 'ticket',
        entityId: ticket.id,
      },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      status: 'success',
      results: history.length,
      data: {
        history,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get ticket statistics
const getTicketStats = async (req, res, next) => {
  try {
    const stats = await Ticket.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['status'],
    });

    const total = stats.reduce((sum, item) => sum + parseInt(item.dataValues.count), 0);
    const byStatus = {};
    stats.forEach(item => {
      byStatus[item.status] = parseInt(item.dataValues.count);
    });

    // Additional stats
    const openTickets = await Ticket.count({
      where: { status: 'open' },
    });

    const inProgressTickets = await Ticket.count({
      where: { status: 'in_progress' },
    });

    const resolvedTickets = await Ticket.count({
      where: { status: 'resolved' },
    });

    const avgResolutionTime = await Ticket.findAll({
      attributes: [
        [
          sequelize.fn('AVG', 
            sequelize.literal("EXTRACT(EPOCH FROM (resolved_at - created_at))/3600")
          ), 
          'avg_hours'
        ]
      ],
      where: {
        status: 'resolved',
        resolvedAt: { [Op.ne]: null }
      },
      raw: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        total,
        byStatus,
        openTickets,
        inProgressTickets,
        resolvedTickets,
        avgResolutionHours: parseFloat(avgResolutionTime[0]?.avg_hours || 0).toFixed(2),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Export tickets to CSV
const exportTicketsToCSV = async (req, res, next) => {
  try {
    const tickets = await Ticket.findAll({
      include: [
        {
          model: User,
          as: 'reporter',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'assignedOfficial',
          attributes: ['name', 'email'],
          include: [
            {
              model: Official,
              attributes: ['position', 'department'],
            },
          ],
        },
      ],
    });

    // Convert to CSV
    const fields = [
      'id',
      'title',
      'status',
      'priority',
      'category',
      'createdAt',
      'updatedAt',
      'reporter.name',
      'reporter.email',
      'assignedOfficial.name',
      'assignedOfficial.email',
      'assignedOfficial.Official.position',
      'assignedOfficial.Official.department',
    ];

    const json2csv = require('json2csv').parse;
    const csv = json2csv(tickets, { fields });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=tickets_export.csv');
    
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTickets,
  getMyTickets,
  createTicket,
  getTicket,
  updateTicket,
  deleteTicket,
  updateTicketStatus,
  assignTicket,
  getTicketComments,
  addComment,
  getTicketHistory,
  getTicketStats,
  exportTicketsToCSV,
};
