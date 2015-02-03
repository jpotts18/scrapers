"use strict";

module.exports = function(sequelize, DataTypes){
  
  var AdExtraction = sequelize.define('ad_extraction', {
    processor: DataTypes.STRING,
    year: DataTypes.STRING,
    zipCode: DataTypes.STRING,
    model: DataTypes.STRING,
    screenSize: DataTypes.STRING,
    memory: DataTypes.STRING,
    hardDrive: DataTypes.STRING,
    title: DataTypes.STRING,
    adNumber: DataTypes.INTEGER,
    postDate: DataTypes.STRING,
    daysOnline: DataTypes.STRING,
    listingType: DataTypes.STRING,
    pageViews: DataTypes.INTEGER,
    sellersAccount: DataTypes.STRING,
    price: DataTypes.INTEGER,
    pictureCount: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    contact: DataTypes.STRING,
    phoneLabel: DataTypes.STRING,
    phone: DataTypes.STRING
  });

  return AdExtraction;

}

