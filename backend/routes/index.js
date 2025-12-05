const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const ticketRoutes = require('./ticketRoutes');
const officialRoutes = require('./officialRoutes');
const projectRoutes = require('./projectRoutes');
const feedbackRoutes = require('./feedbackRoutes');

// API versioning
const apiVersion = 'v1';

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    version: apiVersion,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
router.use(`/api/${apiVersion}/auth`, authRoutes);
router.use(`/api/${apiVersion}/users`, userRoutes);
router.use(`/api/${apiVersion}/tickets`, ticketRoutes);
router.use(`/api/${apiVersion}/officials`, officialRoutes);
router.use(`/api/${apiVersion}/projects`, projectRoutes);
router.use(`/api/${apiVersion}/feedback`, feedbackRoutes);

// 404 handler for API routes
router.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

module.exports = router;
