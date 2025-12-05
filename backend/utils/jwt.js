const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { User } = require('../models');
const AppError = require('./appError');

const signToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id, user.role);
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );

  // Remove password from output
  user.password = undefined;

  // Set cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.cookie('jwt', token, cookieOptions);
  res.cookie('refreshToken', refreshToken, { ...cookieOptions, httpOnly: true });

  res.status(statusCode).json({
    status: 'success',
    token,
    refreshToken,
    data: {
      user
    }
  });
};

const verifyToken = async (token, isRefresh = false) => {
  try {
    const secret = isRefresh ? process.env.JWT_REFRESH_SECRET : process.env.JWT_SECRET;
    const decoded = await promisify(jwt.verify)(token, secret);
    
      // Check if user still exists
    const currentUser = await User.findByPk(decoded.id);
    if (!currentUser) {
      return new AppError('The user belonging to this token no longer exists.', 401);
    }

    // Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return new AppError('User recently changed password! Please log in again.', 401);
    }

    return { valid: true, user: currentUser };
  } catch (error) {
    return { valid: false, error };
  }
};

const protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }

    // 2) Verification token
    const { valid, user, error } = await verifyToken(token);
    
    if (!valid) {
      return next(error || new AppError('Invalid token. Please log in again!', 401));
    }

    // 3) Check if user still exists
    if (!user) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401)
      );
    }

    // 4) Check if user changed password after the token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError('User recently changed password! Please log in again.', 401)
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = user;
    res.locals.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Role-based authorization
const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

module.exports = {
  signToken,
  createSendToken,
  verifyToken,
  protect,
  restrictTo
};
