'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique :true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    tableName: 'Users',
    freezeTableName: true,
  });
  User.associate = function(models) {
    this.hasMany(models.Bid);
  };
  User.hashPassword = password => bcrypt.hash(password, bcrypt.genSaltSync());
  User.prototype.validPassword = function(password) {
    return bcrypt.compare(password, this.password);
  }
  return User;
};
