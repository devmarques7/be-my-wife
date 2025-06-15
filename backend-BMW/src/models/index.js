const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const Present = require('./Present');
const GiftSelection = require('./GiftSelection');
const Admin = require('./Admin');

// Initialize models
const PresentModel = Present(sequelize);
const GiftSelectionModel = GiftSelection(sequelize);
const AdminModel = Admin(sequelize);

// Define associations
GiftSelectionModel.belongsTo(PresentModel);
PresentModel.hasMany(GiftSelectionModel);

module.exports = {
  sequelize,
  Present: PresentModel,
  GiftSelection: GiftSelectionModel,
  Admin: AdminModel
}; 