const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// sequelize.define('모델 이름', { 컬럼 }, { 옵션 })
const Recruitment = sequelize.define('Recruitment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    themeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    meetDate: {
        type: DataTypes.DATE,
        allowNull: false,

    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'OPEN',
    },
}, {
    tableName: 'recruitments',
    underscored: true,
    timestamps: true,
});

module.exports = Recruitment;