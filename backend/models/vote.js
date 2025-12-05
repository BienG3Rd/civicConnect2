const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Vote = sequelize.define('Vote', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    voteType: {
      type: DataTypes.ENUM('up', 'down'),
      allowNull: false,
      field: 'vote_type',
    },
    ipAddress: {
      type: DataTypes.STRING,
      field: 'ip_address',
    },
    userAgent: {
      type: DataTypes.TEXT,
      field: 'user_agent',
    },
  }, {
    tableName: 'votes',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'official_id'],
        name: 'unique_user_official_vote',
      },
    ],
  });

  // Associations
  Vote.associate = (models) => {
    Vote.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'voter',
    });
    
    Vote.belongsTo(models.Official, {
      foreignKey: 'officialId',
      as: 'official',
    });
  };

  return Vote;
};
