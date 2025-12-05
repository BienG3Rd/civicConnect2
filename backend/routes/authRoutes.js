const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, restrictTo } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  refreshTokenSchema,
} = require('../validations/authValidations');

// Public routes
router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.patch('/reset-password/:token', validate(resetPasswordSchema), authController.resetPassword);
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);

// Protected routes (require authentication)
router.use(protect);

router.patch('/update-password', validate(updatePasswordSchema), authController.updatePassword);
router.post('/logout', authController.logout);

// Admin-only routes
router.use(restrictTo('admin'));

module.exports = router;
