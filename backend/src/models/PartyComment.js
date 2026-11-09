const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


// 파티 댓글

const PartyComment = sequelize.define('PartyComment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    partyPostId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    tableName: 'party_comments',
    underscored: true,
    timestamps: true,
    updatedAt: false,
});

module.exports = PartyComment;