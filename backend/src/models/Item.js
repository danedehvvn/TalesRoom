const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Item = sequelize.define('Item', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false, // 상품명
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,  // 상품 설명
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false, // 필요한 포인트 (가격)
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,  // 재고 수량
    },
}, {
    tableName: 'items',
    underscored: true,
    timestamps: true,
});

module.exports = Item;