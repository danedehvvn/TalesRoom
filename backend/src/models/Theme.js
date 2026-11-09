const { DataTypes } = require('sequelize');     // 컬럼 타입 도구
const sequelize = require('../config/db');      // DB 연결 객체


const Theme = sequelize.define('Theme', {
    id: { // 테마 번호
        type: DataTypes.INTEGER,            
        primaryKey: true,                       // DB : pk
        autoIncrement: true, 
    },
    userId: { // 테마 등록한 관리자 ID
        type: DataTypes.STRING(100),            // DB: VARCHAR(100)
        allowNull: false,
    },
    title: { // 테마명
        type: DataTypes.STRING(150),
        allowNull: false,                       
    },
    storeName: { // 매장명
        type: DataTypes.STRING(100),    
        allowNull: false,         
    },
    address: { // 주소
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    longitude: { //x좌표
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true
    },
    latitude: { //y좌표
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true
    },
    content: { //내용
        type: DataTypes.TEXT,        
        allowNull: false,   
    },
    minPeople: { // 최소 인원수
        type: DataTypes.TINYINT,
        allowNull: false, 
        defaultValue: 0,
    },
    maxPeople: { // 최대 인원수
        type: DataTypes.TINYINT,
        allowNull: false, 
        defaultValue: 0,
    },
    playTime: {// 플레이 타임(분 단위)
        type: DataTypes.INTEGER,      
        allowNull: false, 
        defaultValue: 60,
    },
    difficulty: { // 난이도
        type: DataTypes.TINYINT,
        allowNull: false, 
    },
    price: { // 1인 당 이용 가격
        type: DataTypes.INTEGER,
        allowNull: false, 
        defaultValue: 0,
    },
    genre: { // 장르
        type: DataTypes.STRING(50),
        allowNull: false, 
    },
    thumbnailUrl: { //이미지 링크
        type: DataTypes.STRING(2048),
        allowNull: true
    }

}, {
    tableName: 'themes',                         // 실제 테이블 이름
    underscored: true,                          // createdAt <-> created_at 자동 변환
    timestamps: true,                           // created_at, updated_at 자동 관리
});

module.exports = Theme;