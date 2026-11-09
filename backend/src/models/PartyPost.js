const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// 파티 공간 글 작성
const PartyPost = sequelize.define('PartyPost', {
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    recruitmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'party_posts',
    underscored: true,
    timestamps: true,
    updatedAt: false,
});

module.exports = PartyPost;
