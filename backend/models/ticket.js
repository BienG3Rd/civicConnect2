const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Ticket = sequelize.define('Ticket', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 200],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [10, 5000],
      },
    },
    category: {
      type: DataTypes.ENUM(
        'infrastructure',
        'sanitation',
        'public_safety',
        'utilities',
        'transportation',
        'other'
      ),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        'open',
        'in_progress',
        'resolved',
        'closed',
        'reopened',
        'pending'
      ),
      defaultValue: 'open',
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      defaultValue: 'medium',
    },
    location: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mediaUrls: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      field: 'media_urls',
    },
    assignedAt: {
      type: DataTypes.DATE,
      field: 'assigned_at',
    },
    resolvedAt: {
      type: DataTypes.DATE,
      field: 'resolved_at',
    },
    closedAt: {
      type: DataTypes.DATE,
      field: 'closed_at',
    },
  }, {
    tableName: 'tickets',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeUpdate: (ticket) => {
        // Update timestamps based on status changes
        if (ticket.changed('status')) {
          const now = new Date();
          if (ticket.status === 'resolved' && ticket.previous('status') !== 'resolved') {
            ticket.resolvedAt = now;
          } else if (ticket.status === 'closed' && ticket.previous('status') !== 'closed') {
            ticket.closedAt = now;
          }
        }
      },
    },
  });

  // Associations
  Ticket.associate = (models) => {
    Ticket.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'reporter',
    });
    
    Ticket.belongsTo(models.User, {
      foreignKey: 'assignedTo',
      as: 'assignedOfficial',
    });
    
    Ticket.hasMany(models.Feedback, {
      foreignKey: 'ticketId',
      as: 'feedbacks',
    });
    
    Ticket.hasMany(models.AuditLog, {
      foreignKey: 'entityId',
      constraints: false,
      scope: {
        entityType: 'ticket',
      },
    });
  };

  return Ticket;
};
