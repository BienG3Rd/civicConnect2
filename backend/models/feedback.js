const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Feedback = sequelize.define('Feedback', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [10, 2000],
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    sentiment: {
      type: DataTypes.FLOAT,
      comment: 'Sentiment score between -1 (negative) and 1 (positive)',
    },
    isAnonymous: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_anonymous',
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
  }, {
    tableName: 'feedbacks',
    timestamps: true,
    underscored: true,
  });

  // Associations
  Feedback.associate = (models) => {
    Feedback.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    
    Feedback.belongsTo(models.Official, {
      foreignKey: 'officialId',
      as: 'official',
    });
    
    Feedback.belongsTo(models.Ticket, {
      foreignKey: 'ticketId',
      as: 'ticket',
    });
    
    Feedback.hasMany(models.AuditLog, {
      foreignKey: 'entityId',
      constraints: false,
      scope: {
        entityType: 'feedback',
      },
    });
  };

  return Feedback;
};
