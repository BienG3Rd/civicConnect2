const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  updateMeSchema,
  updateUserSchema,
  verifyEmailSchema,
} = require('../validations/userValidations');
const { uploadUserPhoto, resizeUserPhoto } = require('../middleware/upload');

// Apply authentication to all routes
router.use(protect);

// Current user routes
router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/update-me',
  uploadUserPhoto,
  resizeUserPhoto,
  validate(updateMeSchema),
  userController.updateMe
);
router.delete('/delete-me', userController.deleteMe);

// Email verification
router.get('/verify-email/:token', validate(verifyEmailSchema), userController.verifyEmail);

// Admin-only routes
router.use(restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers);
  // .post(validate(createUserSchema), userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(validate(updateUserSchema), userController.updateUser)
  .delete(userController.deleteUser);

// User statistics
router.get('/stats', userController.getUserStats);

module.exports = router;
