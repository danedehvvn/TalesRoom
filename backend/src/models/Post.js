const { DataTypes } = require('sequelize');     // DataTypes = 컬럼 타입(INTEGER, STRING)을 표현하는 도구
const sequelize = require('../config/db');      // 팀원이 만든 DB 연결 객체

// sequelize.define('모델 이름', { 컬럼들 }, { 옵션 })
// 모델 이름은 코드에서 부를 이름, 실제 테이블 이름은 tableName
const Post = sequelize.define('Post', {
    id: {                                       // id, userId : JS에서 쓸 이름
        type: DataTypes.INTEGER,                // DB : integer
        primaryKey: true,                       // DB : pk
        autoIncrement: true,                    // DB : increment (1, 2, 3... 자동 번호)
    },
    userId: {
        type: DataTypes.STRING(100),            // DB : user_id varchar(100), users.id가 문자열 아이디라서 STRING
        allowNull: false,                       // DB : not null
    },
    category: {
        type: DataTypes.STRING(50),             // INFO / QUESTION / CHAT / DEBATE
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,                   // 긴 글이라 TEXT
        allowNull: false,
    },
    viewCount: {
        type: DataTypes.INTEGER,                // DB: view_count
        allowNull: false,
        defaultValue: 0,                        // 값을 안 주면 0으로 저장
    },
    isSpoiler: {
         type: DataTypes.TINYINT,                    // DB: is_spoiler tinyint (0 또는 1)
        allowNull: false,
        defaultValue: 0,
    },
    isNotice: {
        type: DataTypes.TINYINT,                    // DB: is_notice tinyint (0 또는 1)
        allowNull: false,
        defaultValue: 0,
    },
}, {
    tableName: 'posts',                             // 실제 테이블 이름, 안 쓰면 Sequelize가 'Posts'로 추측해서 못찾을 수 있음
    underscored: true,                              // JS의 userId <-> DB의 user_id 처럼 이름을 자동 변환
    timestamps: true,                               // created_at, updated_at을 Sequelize가 자동으로 채움
});

// 다른 파일에서 require('../models/Post')로 쓸 수 있게 내보냄.
module.exports = Post;

