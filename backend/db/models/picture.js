'use strict';
module.exports = (sequelize, DataTypes) => {
  const Picture = sequelize.define('Picture', {
    title: DataTypes.STRING,
    photographer: DataTypes.STRING,
    imageFilename: DataTypes.STRING,
    startingPrice: DataTypes.INTEGER
  }, {
    tableName: 'Pictures'
  });
  Picture.associate = function(models) {
    this.hasMany(models.Bid);
  };
  return Picture;
};