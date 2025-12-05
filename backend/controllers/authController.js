const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { User } = require('../models');
const { createSendToken } = require('../utils/jwt');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

// Helper function to filter allowed fields for user updates
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// User Registration
const signup = async (req, res, next) => {
  try {
    // 1) Check if email already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: req.body.email },
          { phone: req.body.phone },
          { nationalId: req.body.nationalId }
        ]
      }
    });

    if (existingUser) {
      return next(new AppError('User with this email, phone, or national ID already exists', 400));
    }

    // 2) Create new user
    const filteredBody = filterObj(
      req.body,
      'name',
      'email',
      'password',
      'passwordConfirm',
      'phone',
      'nationalId',
      'role'
    );

    // Only allow admins to create admin users
    if (filteredBody.role === 'admin' && (!req.user || req.user.role !== 'admin')) {
      return next(new AppError('Only admins can create admin accounts', 403));
    }

    // 3) Create user in database
    const newUser = await User.create(filteredBody);

    // 4) Generate token and send response
    createSendToken(newUser, 201, res);
  } catch (error) {
    next(error);
  }
};

// User Login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Logout (Clear cookies)
const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

// Forgot Password
const forgotPassword = async (req, res, next) => {
  try {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return next(new AppError('There is no user with that email address.', 404));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message
      });

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError('There was an error sending the email. Try again later!'),
        500
      );
    }
  } catch (error) {
    next(error);
  }
};

// Reset Password
const resetPassword = async (req, res, next) => {
  try {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { [Op.gt]: Date.now() }
      }
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user
    // This is handled by the model hook

    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Update Password
const updatePassword = async (req, res, next) => {
  try {
    // 1) Get user from collection
    const user = await User.findByPk(req.user.id);

    // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
      return next(new AppError('Your current password is wrong.', 401));
    }

    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Refresh Token
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return next(new AppError('No refresh token provided', 400));
    }

    const { valid, user, error } = await verifyToken(refreshToken, true);
    
    if (!valid || !user) {
      return next(error || new AppError('Invalid refresh token', 401));
    }

    // Generate new access token
    const token = signToken(user.id, user.role);
    
    res.status(200).json({
      status: 'success',
      token,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  refreshToken
};
