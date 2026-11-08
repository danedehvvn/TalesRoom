const { DataTypes } = require('sequelize');     // DataTypes = 컬럼 타입(INTEGER, STRING)을 표현하는 도구
const sequelize = require('../config/db');      //DB 연결 객체

// sequelize.define('모델 이름', { 컬럼들 }, { 옵션 })
// 모델 이름은 코드에서 부를 이름, 실제 테이블 이름은 tableName
const PostReaction = sequelize.define('PostReaction', {
    id: {                                       //id(PK)
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    postId: {                                   //게시글 번호(FK)
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'posts',
            key: 'id',
        },
    },
    userId: {                                   //좋아요를 누른 사용자(FK)
        type: DataTypes.STRING(100),            
        allowNull: false,                       //not null
        references: {
            model: 'users',
            key: 'id',
        },
    }
}, {
    tableName: 'post_reactions',
    underscored: true,                          //JS는 camelCase, DB는 snake_case를 쓰는데, 이 옵션이 둘을 자동으로 이어줌
    updatedAt: false,                           //updated_at을 Sequelize가 자동으로 채우지 않음(updated_at 컬럼 없음 (생성/삭제만 함))
    timestamps: true,                           //created_at을 Sequelize가 자동으로 채움
});

module.exports = PostReaction;

