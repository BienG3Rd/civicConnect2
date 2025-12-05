const { Op, literal, QueryTypes } = require('sequelize');
const { User, Official, Vote, Ticket, Feedback, sequelize } = require('../models');
const AppError = require('../utils/appError');
const { filterObj } = require('../utils/helpers');
const { uploadToS3 } = require('../services/fileUpload');
const { sendOfficialVerificationEmail } = require('../services/emailService');

// Helper function to calculate official's performance score
const calculatePerformanceScore = async (officialId) => {
  // Get ticket statistics
  const ticketStats = await Ticket.findAll({
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('id')), 'totalTickets'],
      [
        sequelize.literal(`COUNT(CASE WHEN status = 'resolved' THEN 1 END)`),
        'resolvedTickets',
      ],
      [
        sequelize.literal(
          `AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600) FILTER (WHERE status = 'resolved' AND resolved_at IS NOT NULL)`
        ),
        'avgResolutionTimeHours',
      ],
    ],
    where: { assignedTo: officialId },
    raw: true,
  });

  // Get feedback statistics
  const feedbackStats = await Feedback.findAll({
    attributes: [
      [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'totalFeedback'],
    ],
    where: { officialId },
    raw: true,
  });

  // Get vote statistics
  const voteStats = await Vote.findAll({
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('id')), 'totalVotes'],
      [
        sequelize.literal(
          `COUNT(CASE WHEN vote_type = 'up' THEN 1 END) / NULLIF(COUNT(*), 0) * 100`
        ),
        'approvalRating',
      ],
    ],
    where: { officialId },
    raw: true,
  });

  // Calculate performance score (weighted average of different metrics)
  const resolvedPercentage = ticketStats[0]?.totalTickets > 0 
    ? (ticketStats[0].resolvedTickets / ticketStats[0].totalTickets) * 100 
    : 0;
  
  const avgRating = parseFloat(feedbackStats[0]?.avgRating || 0);
  const avgResolutionTime = parseFloat(ticketStats[0]?.avgResolutionTimeHours || 0);
  const approvalRating = parseFloat(voteStats[0]?.approvalRating || 0);
  
  // Weights for different metrics (can be adjusted)
  const WEIGHTS = {
    RESOLUTION_RATE: 0.3,
    AVERAGE_RATING: 0.3,
    APPROVAL_RATING: 0.2,
    RESPONSE_TIME: 0.2,
  };

  // Normalize and calculate score (0-100 scale)
  const resolutionScore = Math.min(resolvedPercentage, 100);
  const ratingScore = avgRating * 20; // Convert 1-5 scale to 0-100
  const approvalScore = approvalRating;
  
  // Lower resolution time is better, so we invert it (with a max of 7 days)
  const maxResolutionTime = 24 * 7; // 7 days in hours
  const responseTimeScore = Math.max(0, 100 - (avgResolutionTime / maxResolutionTime) * 100);

  // Calculate weighted score
  const performanceScore = 
    (resolutionScore * WEIGHTS.RESOLUTION_RATE) +
    (ratingScore * WEIGHTS.AVERAGE_RATING) +
    (approvalScore * WEIGHTS.APPROVAL_RATING) +
    (responseTimeScore * WEIGHTS.RESPONSE_TIME);

  return {
    performanceScore: Math.round(performanceScore * 10) / 10, // Round to 1 decimal
    metrics: {
      totalTickets: parseInt(ticketStats[0]?.totalTickets || 0),
      resolvedTickets: parseInt(ticketStats[0]?.resolvedTickets || 0),
      resolutionRate: Math.round(resolvedPercentage * 10) / 10,
      avgRating: Math.round(avgRating * 10) / 10,
      approvalRating: Math.round(approvalRating * 10) / 10,
      avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
    },
  };
};

// Get all officials with optional filtering and pagination
const getAllOfficials = async (req, res, next) => {
  try {
    const {
      department,
      position,
      minScore,
      maxScore,
      isActive,
      search,
      sort = '-performanceScore',
      page = 1,
      limit = 10,
    } = req.query;

    // Build where clause
    const where = {};
    const userWhere = {};
    
    if (department) where.department = department;
    if (position) where.position = position;
    if (minScore) where.performanceScore = { [Op.gte]: parseFloat(minScore) };
    if (maxScore) where.performanceScore = { ...where.performanceScore, [Op.lte]: parseFloat(maxScore) };
    if (isActive !== undefined) userWhere.isActive = isActive === 'true';
    
    // Search by name or email
    if (search) {
      userWhere[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Execute query with pagination
    const offset = (page - 1) * limit;
    const { count, rows: officials } = await Official.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'profileImage', 'isActive', 'lastLogin'],
          where: userWhere,
        },
      ],
      order: [
        sort.startsWith('-') 
          ? [sort.slice(1), 'DESC'] 
          : [sort, 'ASC'],
        ['createdAt', 'DESC'],
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // Get unique departments and positions for filters
    const departments = await Official.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('department')), 'department']],
      raw: true,
    });

    const positions = await Official.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('position')), 'position']],
      raw: true,
    });

    res.status(200).json({
      status: 'success',
      results: officials.length,
      data: {
        officials,
        pagination: {
          total: count,
          totalPages,
          currentPage: parseInt(page),
          hasNextPage,
          hasPreviousPage,
        },
        filters: {
          departments: departments.map(d => d.department).filter(Boolean),
          positions: positions.map(p => p.position).filter(Boolean),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get a single official by ID
const getOfficial = async (req, res, next) => {
  try {
    const official = await Official.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'profileImage', 'isActive', 'lastLogin'],
        },
      ],
    });

    if (!official) {
      return next(new AppError('No official found with that ID', 404));
    }

    // Calculate performance metrics
    const performance = await calculatePerformanceScore(official.id);

    res.status(200).json({
      status: 'success',
      data: {
        official: {
          ...official.toJSON(),
          ...performance,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get official performance metrics
const getOfficialPerformance = async (req, res, next) => {
  try {
    const official = await Official.findByPk(req.params.id);

    if (!official) {
      return next(new AppError('No official found with that ID', 404));
    }

    const performance = await calculatePerformanceScore(official.id);

    // Get recent tickets
    const recentTickets = await Ticket.findAll({
      where: { assignedTo: official.id },
      order: [['createdAt', 'DESC']],
      limit: 5,
      include: [
        {
          model: User,
          as: 'reporter',
          attributes: ['name', 'email'],
        },
      ],
    });

    // Get recent feedback
    const recentFeedback = await Feedback.findAll({
      where: { officialId: official.id },
      order: [['createdAt', 'DESC']],
      limit: 5,
      include: [
        {
          model: User,
          attributes: ['name', 'email'],
        },
      ],
    });

    // Get performance trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyPerformance = await sequelize.query(
      `
      SELECT 
        DATE_TRUNC('month', t.resolved_at) AS month,
        COUNT(*) AS resolved_tickets,
        AVG(EXTRACT(EPOCH FROM (t.resolved_at - t.created_at))/3600) AS avg_resolution_hours,
        AVG(f.rating) AS avg_rating
      FROM tickets t
      LEFT JOIN feedbacks f ON f.ticket_id = t.id
      WHERE 
        t.assigned_to = :officialId 
        AND t.status = 'resolved' 
        AND t.resolved_at >= :sixMonthsAgo
      GROUP BY DATE_TRUNC('month', t.resolved_at)
      ORDER BY month ASC
      `,
      {
        replacements: { officialId: official.id, sixMonthsAgo },
        type: QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        ...performance,
        recentTickets,
        recentFeedback,
        trends: {
          monthlyPerformance,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create a new official (Admin only)
const createOfficial = async (req, res, next) => {
  try {
    const { userId, position, department, jurisdiction, bio, contactEmail, contactPhone, officeAddress } = req.body;

    // Check if user exists and is not already an official
    const user = await User.findByPk(userId);
    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    const existingOfficial = await Official.findOne({ where: { userId } });
    if (existingOfficial) {
      return next(new AppError('This user is already registered as an official', 400));
    }

    // Handle file upload if any
    let profileImage;
    if (req.file) {
      const result = await uploadToS3(req.file);
      profileImage = result.Location;
    }

    // Create official profile
    const official = await Official.create({
      userId,
      position,
      department,
      jurisdiction,
      bio,
      contactEmail,
      contactPhone,
      officeAddress,
      profileImage,
      isActive: true,
      startDate: new Date(),
    });

    // Update user role to 'official' if needed
    if (user.role === 'citizen') {
      await user.update({ role: 'official' });
    }

    // Send verification email
    await sendOfficialVerificationEmail(user, official);

    res.status(201).json({
      status: 'success',
      data: {
        official,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update an official's profile (Admin or self)
const updateOfficial = async (req, res, next) => {
  try {
    const official = await Official.findByPk(req.params.id, {
      include: [{ model: User }],
    });

    if (!official) {
      return next(new AppError('No official found with that ID', 404));
    }

    // Check permissions (admin or self)
    if (req.user.role !== 'admin' && official.userId !== req.user.id) {
      return next(
        new AppError('You do not have permission to update this official profile', 403)
      );
    }

    // Filter allowed fields
    const allowedFields = [
      'position',
      'department',
      'jurisdiction',
      'bio',
      'contactEmail',
      'contactPhone',
      'officeAddress',
      'isActive',
    ];

    const updateData = filterObj(req.body, ...allowedFields);

    // Handle file upload if any
    if (req.file) {
      const result = await uploadToS3(req.file);
      updateData.profileImage = result.Location;
      
      // Delete old profile image if it exists
      if (official.profileImage) {
        // TODO: Implement S3 file deletion if needed
      }
    }

    // Update official
    await official.update(updateData);

    // Update user data if needed
    if (req.body.name || req.body.email) {
      const userUpdate = {};
      if (req.body.name) userUpdate.name = req.body.name;
      if (req.body.email) userUpdate.email = req.body.email;
      
      await official.User.update(userUpdate);
    }

    // Get updated official with user data
    const updatedOfficial = await Official.findByPk(official.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'profileImage', 'isActive', 'lastLogin'],
        },
      ],
    });

    res.status(200).json({
      status: 'success',
      data: {
        official: updatedOfficial,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete an official (Admin only)
const deleteOfficial = async (req, res, next) => {
  try {
    const official = await Official.findByPk(req.params.id);

    if (!official) {
      return next(new AppError('No official found with that ID', 404));
    }

    // Prevent deleting self
    if (official.userId === req.user.id) {
      return next(new AppError('You cannot delete your own official profile', 400));
    }

    // Soft delete the official
    await official.destroy();

    // Update user role back to citizen
    await User.update(
      { role: 'citizen' },
      { where: { id: official.userId } }
    );

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// Vote for an official
const voteOfficial = async (req, res, next) => {
  try {
    const { voteType } = req.body;
    const { id: officialId } = req.params;

    // Check if official exists and is active
    const official = await Official.findOne({
      where: { id: officialId },
      include: [{ model: User, where: { isActive: true } }],
    });

    if (!official) {
      return next(new AppError('No active official found with that ID', 404));
    }

    // Check if user has already voted for this official
    const existingVote = await Vote.findOne({
      where: {
        userId: req.user.id,
        officialId,
      },
    });

    let vote;
    
    if (existingVote) {
      // Update existing vote if different
      if (existingVote.voteType !== voteType) {
        existingVote.voteType = voteType;
        await existingVote.save();
        vote = existingVote;
      } else {
        // Remove vote if clicking the same button again
        await existingVote.destroy();
        vote = null;
      }
    } else {
      // Create new vote
      vote = await Vote.create({
        userId: req.user.id,
        officialId,
        voteType,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });
    }

    // Recalculate official's performance score
    const performance = await calculatePerformanceScore(officialId);
    await official.update({
      performanceScore: performance.performanceScore,
    });

    res.status(200).json({
      status: 'success',
      data: {
        vote,
        performance: {
          score: performance.performanceScore,
          metrics: performance.metrics,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get officials statistics (Admin only)
const getOfficialsStats = async (req, res, next) => {
  try {
    // Total officials count
    const totalOfficials = await Official.count();
    
    // Officials by department
    const byDepartment = await Official.findAll({
      attributes: [
        'department',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['department'],
      order: [[sequelize.literal('count'), 'DESC']],
    });

    // Performance distribution
    const performanceDistribution = await sequelize.query(
      `
      SELECT 
        CASE
          WHEN performance_score >= 80 THEN 'Excellent (80-100)'
          WHEN performance_score >= 60 THEN 'Good (60-79)'
          WHEN performance_score >= 40 THEN 'Average (40-59)'
          ELSE 'Needs Improvement (0-39)'
        END AS performance_range,
        COUNT(*) AS count,
        ROUND(AVG(performance_score), 1) AS avg_score
      FROM officials
      GROUP BY performance_range
      ORDER BY performance_range
      `,
      { type: QueryTypes.SELECT }
    );

    // Top performing officials
    const topOfficials = await Official.findAll({
      include: [
        {
          model: User,
          attributes: ['name', 'email'],
        },
      ],
      order: [['performanceScore', 'DESC']],
      limit: 5,
    });

    // Recent activity
    const recentActivity = await AuditLog.findAll({
      where: {
        [Op.or]: [
          { action: 'CREATE_TICKET' },
          { action: 'UPDATE_TICKET_STATUS' },
          { action: 'VOTE_OFFICIAL' },
          { action: 'SUBMIT_FEEDBACK' },
        ],
      },
      include: [
        {
          model: User,
          attributes: ['name', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    res.status(200).json({
      status: 'success',
      data: {
        totalOfficials,
        byDepartment,
        performanceDistribution,
        topOfficials,
        recentActivity,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllOfficials,
  getOfficial,
  getOfficialPerformance,
  createOfficial,
  updateOfficial,
  deleteOfficial,
  voteOfficial,
  getOfficialsStats,
};
