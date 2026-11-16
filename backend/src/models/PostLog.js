const { DataTypes } = require('sequelize');     // 컬럼 타입 도구
const sequelize = require('../config/db');      // DB 연결 객체

// 게시글 수정 로그

const PostLog = sequelize.define('PostLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,                    // 로그 번호 증가
    },
    postId: {
        type: DataTypes.INTEGER,                // DB, post_id. 어느 글의 기록인지??
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING(100),            // DB, user_id. 누가 수정했는지??
        allowNull: false,
    },
    category: { type: DataTypes.STRING(50), allowNull: false },     // 수정 전 내용
    title: { type: DataTypes.STRING(200), allowNull: false },
    content: {type: DataTypes.TEXT, allowNull: false },
    isSpoiler: { type: DataTypes.TINYINT, allowNull: false },
    isNotice: { type: DataTypes.TINYINT, allowNull: false },
}, {
    tableName: 'posts_logs',    // 실제 DB 테이블 이름
    underscored: true,          // postId <-> post_id 변환
    timestamps: true,           // created_at 자동 기록
    updatedAt: false,           // 업데이트 없으면 동작하지 않음
});

module.exports = PostLog;