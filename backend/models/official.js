const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Official = sequelize.define('Official', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    jurisdiction: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    profileImage: {
      type: DataTypes.STRING,
      field: 'profile_image',
    },
    contactEmail: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
      field: 'contact_email',
    },
    contactPhone: {
      type: DataTypes.STRING,
      field: 'contact_phone',
    },
    officeAddress: {
      type: DataTypes.TEXT,
      field: 'office_address',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
    startDate: {
      type: DataTypes.DATE,
      field: 'start_date',
    },
    endDate: {
      type: DataTypes.DATE,
      field: 'end_date',
    },
    performanceScore: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      field: 'performance_score',
    },
    responseTime: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      field: 'response_time',
    },
    resolutionRate: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      field: 'resolution_rate',
    },
  }, {
    tableName: 'officials',
    timestamps: true,
    underscored: true,
  });

  // Associations
  Official.associate = (models) => {
    Official.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    
    Official.hasMany(models.Ticket, {
      foreignKey: 'assignedTo',
      as: 'assignedTickets',
    });
    
    Official.hasMany(models.Project, {
      foreignKey: 'officialId',
      as: 'projects',
    });
    
    Official.hasMany(models.Feedback, {
      foreignKey: 'officialId',
      as: 'feedbacks',
    });
    
    Official.hasMany(models.Vote, {
      foreignKey: 'officialId',
      as: 'votes',
    });
    
    Official.hasMany(models.AuditLog, {
      foreignKey: 'entityId',
      constraints: false,
      scope: {
        entityType: 'official',
      },
    });
  };

  return Official;
};
