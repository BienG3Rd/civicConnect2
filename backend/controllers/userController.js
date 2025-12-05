const { Op } = require('sequelize');
const { User } = require('../models');
const AppError = require('../utils/appError');
const { filterObj } = require('../utils/helpers');

// Helper function to filter allowed fields for user updates
const filterUpdateBody = (body, ...allowedFields) => {
  return filterObj(body, ...allowedFields);
};

// Get all users (Admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'passwordChangedAt'] },
    });

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// Get user by ID
const getUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'passwordChangedAt'] },
    });

    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update current user profile
const updateMe = async (req, res, next) => {
  try {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /updateMyPassword.',
          400
        )
      );
    }

    // 2) Filtered out unwanted fields that are not allowed to be updated
    const filteredBody = filterUpdateBody(
      req.body,
      'name',
      'email',
      'phone',
      'profileImage'
    );

    // 3) Update user document
    const updatedUser = await req.user.update(filteredBody);

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete current user (set active to false)
const deleteMe = async (req, res, next) => {
  try {
    await req.user.update({ active: false });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// Update user (Admin only)
const updateUser = async (req, res, next) => {
  try {
    // 1) Filter out unwanted fields that are not allowed to be updated
    const filteredBody = filterUpdateBody(
      req.body,
      'name',
      'email',
      'role',
      'isVerified',
      'phone',
      'nationalId',
      'active'
    );

    // 2) Update user document
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    // Prevent changing own role
    if (req.user.id === user.id && filteredBody.role && filteredBody.role !== user.role) {
      return next(new AppError('You cannot change your own role', 400));
    }

    await user.update(filteredBody);

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete user (Admin only)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    // Prevent deleting own account
    if (req.user.id === user.id) {
      return next(new AppError('You cannot delete your own account', 400));
    }

    await user.destroy();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// Get user statistics (Admin only)
const getUserStats = async (req, res, next) => {
  try {
    const stats = await User.findAll({
      attributes: [
        'role',
        [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN "isVerified" = true THEN 1 ELSE 0 END')), 'verified'],
        [sequelize.fn('MAX', sequelize.col('createdAt')), 'latestSignup']
      ],
      group: ['role'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Verify user email
const verifyEmail = async (req, res, next) => {
  try {
    const verificationToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      where: {
        emailVerificationToken: verificationToken,
        emailVerificationExpires: { [Op.gt]: Date.now() }
      }
    });

    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validate: false });

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getMe,
  getUser,
  updateMe,
  deleteMe,
  updateUser,
  deleteUser,
  getUserStats,
  verifyEmail,
};
