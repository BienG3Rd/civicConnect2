const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^[0-9+\-\s()]{10,20}$/,
      },
    },
    nationalId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      field: 'national_id',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(value, salt);
        this.setDataValue('password', hash);
      },
    },
    role: {
      type: DataTypes.ENUM('citizen', 'official', 'admin', 'auditor'),
      defaultValue: 'citizen',
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_verified',
    },
    lastLogin: {
      type: DataTypes.DATE,
      field: 'last_login',
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      field: 'reset_password_token',
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      field: 'reset_password_expires',
    },
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    defaultScope: {
      attributes: {
        exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'],
      },
    },
  });

  // Instance methods
  User.prototype.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  // Associations
  User.associate = (models) => {
    User.hasMany(models.Ticket, {
      foreignKey: 'userId',
      as: 'tickets',
    });

    User.hasMany(models.Feedback, {
      foreignKey: 'userId',
      as: 'feedbacks',
    });

    User.hasMany(models.Vote, {
      foreignKey: 'userId',
      as: 'votes',
    });
  };

  return User;
};
