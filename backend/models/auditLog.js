const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    entityType: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'entity_type',
      validate: {
        notEmpty: true,
      },
    },
    entityId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'entity_id',
    },
    previousValues: {
      type: DataTypes.JSONB,
      field: 'previous_values',
    },
    newValues: {
      type: DataTypes.JSONB,
      field: 'new_values',
    },
    ipAddress: {
      type: DataTypes.STRING,
      field: 'ip_address',
    },
    userAgent: {
      type: DataTypes.TEXT,
      field: 'user_agent',
    },
    status: {
      type: DataTypes.ENUM('success', 'failure', 'pending'),
      defaultValue: 'success',
    },
    error: {
      type: DataTypes.TEXT,
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
  }, {
    tableName: 'audit_logs',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['entity_type', 'entity_id'],
      },
      {
        fields: ['user_id'],
      },
      {
        fields: ['created_at'],
      },
    ],
  });

  // Associations
  AuditLog.associate = (models) => {
    AuditLog.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return AuditLog;
};
