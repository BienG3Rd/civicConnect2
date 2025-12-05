const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Project = sequelize.define('Project', {
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
      },
    },
    budget: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    spent: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    status: {
      type: DataTypes.ENUM(
        'planning',
        'in_progress',
        'on_hold',
        'completed',
        'cancelled'
      ),
      defaultValue: 'planning',
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
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
    startDate: {
      type: DataTypes.DATE,
      field: 'start_date',
    },
    endDate: {
      type: DataTypes.DATE,
      field: 'end_date',
    },
    actualEndDate: {
      type: DataTypes.DATE,
      field: 'actual_end_date',
    },
    imageUrls: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      field: 'image_urls',
    },
    documents: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_public',
    },
  }, {
    tableName: 'projects',
    timestamps: true,
    underscored: true,
  });

  // Associations
  Project.associate = (models) => {
    Project.belongsTo(models.Official, {
      foreignKey: 'officialId',
      as: 'official',
    });
    
    Project.belongsToMany(models.User, {
      through: 'project_team_members',
      as: 'teamMembers',
      foreignKey: 'projectId',
      otherKey: 'userId',
    });
    
    Project.hasMany(models.AuditLog, {
      foreignKey: 'entityId',
      constraints: false,
      scope: {
        entityType: 'project',
      },
    });
    
    Project.hasMany(models.Ticket, {
      foreignKey: 'projectId',
      as: 'tickets',
    });
  };

  return Project;
};
