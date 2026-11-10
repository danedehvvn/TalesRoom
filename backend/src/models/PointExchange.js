const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PointExchange = sequelize.define('PointExchange', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.STRING(100),
        allowNull: false, // 교환한 유저 ID
    },
    itemId: {
        type: DataTypes.INTEGER,
        allowNull: false, // 교환한 상품 ID
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,  // 교환 수량
    },
    usedPoints: {
        type: DataTypes.INTEGER,
        allowNull: false, // 당시 소모된 총 포인트 (price * quantity)
    },
}, {
    tableName: 'point_exchanges',
    underscored: true,
    timestamps: true, //교환 일시(createdAt) 자동 기록
});

module.exports = PointExchange;