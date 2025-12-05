const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { protect, restrictTo } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  createTicketSchema,
  updateTicketSchema,
  assignTicketSchema,
  addCommentSchema,
  updateStatusSchema,
} = require('../validations/ticketValidations');
const { uploadTicketFiles } = require('../middleware/upload');

// Apply authentication to all routes
router.use(protect);

// Routes for all authenticated users
router
  .route('/')
  .get(ticketController.getAllTickets)
  .post(
    uploadTicketFiles,
    validate(createTicketSchema),
    ticketController.createTicket
  );

// Routes for ticket creators and admins
router
  .route('/my-tickets')
  .get(ticketController.getMyTickets);

// Routes for specific ticket
router
  .route('/:id')
  .get(ticketController.getTicket)
  .patch(
    uploadTicketFiles,
    validate(updateTicketSchema),
    ticketController.updateTicket
  )
  .delete(ticketController.deleteTicket);

// Ticket status updates
router.patch(
  '/:id/status',
  validate(updateStatusSchema),
  ticketController.updateTicketStatus
);

// Ticket assignment (admin/official only)
router.patch(
  '/:id/assign',
  restrictTo('admin', 'official'),
  validate(assignTicketSchema),
  ticketController.assignTicket
);

// Ticket comments
router
  .route('/:id/comments')
  .get(ticketController.getTicketComments)
  .post(validate(addCommentSchema), ticketController.addComment);

// Ticket history/audit log
router.get('/:id/history', ticketController.getTicketHistory);

// Admin-only routes
router.use(restrictTo('admin'));

router.get('/stats/overview', ticketController.getTicketStats);
router.get('/export/csv', ticketController.exportTicketsToCSV);

module.exports = router;
