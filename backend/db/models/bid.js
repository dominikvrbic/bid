'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bid = sequelize.define('Bid', {
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
        allowNull: false,
      
    },
    pictureId: {
      type: DataTypes.INTEGER,
        allowNull: false,
       
    }
  }, {
    tableName: 'Bids'
  });
  Bid.associate = function(models) {
    this.belongsTo(models.User);
    this.belongsTo(models.Picture);
  };
  return Bid;
};