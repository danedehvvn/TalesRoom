const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const Bookmark = sequelize.define('Bookmark', {
  userId: {
    type: DataTypes.STRING(100),
    primaryKey: true,
    allowNull: false,
  },
  themeId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  }
}, {
  tableName: 'bookmarks',
  underscored: true,
  timestamps: true,
  updatedAt: false
});

module.exports = Bookmark;
