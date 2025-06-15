const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const GiftSelection = sequelize.define('GiftSelection', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    presentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Presents',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    selectionDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return GiftSelection;
}; 