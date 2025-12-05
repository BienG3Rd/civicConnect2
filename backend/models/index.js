const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db');
const User = require('./user');
const Ticket = require('./ticket');
const Official = require('./official');
const Vote = require('./vote');
const Feedback = require('./feedback');
const Project = require('./project');
const AuditLog = require('./auditLog');

const sequelize = dbConfig;

// Initialize models
const models = {
  User: User(sequelize, Sequelize),
  Ticket: Ticket(sequelize, Sequelize),
  Official: Official(sequelize, Sequelize),
  Vote: Vote(sequelize, Sequelize),
  Feedback: Feedback(sequelize, Sequelize),
  Project: Project(sequelize, Sequelize),
  AuditLog: AuditLog(sequelize, Sequelize),
};

// Define relationships
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Export models and sequelize
module.exports = {
  ...models,
  sequelize,
  Sequelize
};
