const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// 모집 모델 : 댓글로 신청 -> 작성자가 승인
const RecruitmentApplication = sequelize. define('RecruitmentApplication', {
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
        allowNull:false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'PENDING',
    },
}, {
    tableName: 'recruitment_applications',
    underscored: true,
    timestamps: true,
    updatedAt: false,
});

module.exports = RecruitmentApplication;