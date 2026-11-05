const { DataTypes } = require('sequelize');     // 컬럼 타입 도구
const sequelize = require('../config/db');      // DB 연결 객체

const ThemeReview = sequelize.define('ThemeReview', {
    id: { // 리뷰 번호
        type: DataTypes.INTEGER,            
        primaryKey: true,                       // DB : pk
        autoIncrement: true, 
    },
    themeId: { // 테마 id
        type: DataTypes.INTEGER,    
        //FK themes.id
        allowNull: false,
    },
    userId: { // 작성자 id
        type: DataTypes.STRING(100),
        //FK user.id
        allowNull: false,                       
    },
    content: { // 내용
        type: DataTypes.TEXT,    
        allowNull: false,         
    },
    rating: { // 별점
        type: DataTypes.TINYINT, //(1~5)
        allowNull: false,
    },

}, {
    tableName: 'theme_reviews',                         // 실제 테이블 이름
    underscored: true,                          // createdAt <-> created_at 자동 변환
    timestamps: true,                           // created_at 자동 관리
    updatedAt: false                          //updated_at 없음
});

module.exports = ThemeReview;