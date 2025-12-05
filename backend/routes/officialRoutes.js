const express = require('express');
const router = express.Router();
const officialController = require('../controllers/officialController');
const { protect, restrictTo } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  createOfficialSchema,
  updateOfficialSchema,
  voteOfficialSchema,
} = require('../validations/officialValidations');
const { uploadOfficialPhoto, resizeOfficialPhoto } = require('../middleware/upload');

// Public routes
router.get('/', officialController.getAllOfficials);
router.get('/:id', officialController.getOfficial);
router.get('/:id/performance', officialController.getOfficialPerformance);

// Protected routes (require authentication)
router.use(protect);

// Voting on officials
router.post(
  '/:id/vote',
  validate(voteOfficialSchema),
  officialController.voteOfficial
);

// Admin-only routes
router.use(restrictTo('admin'));

router
  .route('/')
  .post(
    uploadOfficialPhoto,
    resizeOfficialPhoto,
    validate(createOfficialSchema),
    officialController.createOfficial
  );

router
  .route('/:id')
  .patch(
    uploadOfficialPhoto,
    resizeOfficialPhoto,
    validate(updateOfficialSchema),
    officialController.updateOfficial
  )
  .delete(officialController.deleteOfficial);

// Official statistics
router.get('/stats/overview', officialController.getOfficialsStats);

module.exports = router;
