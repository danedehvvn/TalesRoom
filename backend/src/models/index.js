// 모델을 한 곳에 모으고, 모델 끼리의 관계를 정하는 작업

const sequelize = require('../config/db');      // DB 연결 객체
const User = require('./User');                 // 회원 모델
const Post = require('./Post');                 // 게시글 모델
const PostLog = require('./PostLog');

// 회원 1명 -> 글 여러개 (1:N)
User.hasMany(Post, { foreignKey: 'userId' });

// 글 1개 -> 작성자 1명 (N:1)
// as: 'author' -> 작성자 정보가 'author'라는 이름으로 들어감.
Post.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// + 수정 기록 여러개 (1:N)
Post.hasMany(PostLog, { foreignKey: 'postId' });

// 다른 파일에서 const { Post, User } = require('../models'); 로 꺼내 쓸 수 있게 내보내는 작업
module.exports = { sequelize, User, Post, PostLog };