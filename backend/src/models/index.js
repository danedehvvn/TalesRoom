// 모델을 한 곳에 모으고, 모델 끼리의 관계를 정하는 작업

const sequelize = require('../config/db');      // DB 연결 객체
const User = require('./User');                 // 회원 모델
const Post = require('./Post');                 // 게시글 모델
const PostLog = require('./PostLog');
const Theme= require('./Theme');                // 테마 모델
const ThemeReview = require('./ThemeReview');   // 후기평점 모델
const Comment = require('./Comment');   // 댓글 모델

// 회원 1명 -> 글 여러개 (1:N)
User.hasMany(Post, { foreignKey: 'userId' });

// 글 1개 -> 작성자 1명 (N:1)
// as: 'author' -> 작성자 정보가 'author'라는 이름으로 들어감.
Post.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// + 수정 기록 여러개 (1:N)
Post.hasMany(PostLog, { foreignKey: 'postId' });

// 다른 파일에서 const { Post, User } = require('../models'); 로 꺼내 쓸 수 있게 내보내는 작업
module.exports = { sequelize, User, Post, PostLog };
// 회원(관리자) 1명 -> 테마 여러개 (1:N)
User.hasMany(Theme, {foreignKey: 'userId'});
Theme.belongsTo(User, {foreignKey: 'userId', as: 'author' })

//테마 1개 -> 후기 여러개 (1:N)
Theme.hasMany(ThemeReview,{foreignKey:'themeId'})
ThemeReview.belongsTo(Theme,{foreignKey:'themeId'})

// 회원 1명 → 후기 여러 개 (1:N)
User.hasMany(ThemeReview, {foreignKey:'userId'});
ThemeReview.belongsTo(User, {foreignKey:'userId', as: 'author'});

// 게시글 1개 -> 댓글 여러 개 (1:N)
Post.hasMany(Comment, { foreignKey: 'postId' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

// 회원 1명 -> 댓글 여러 개 (1:N)
User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });



// 다른 파일에서 const { Post, User } = require('../models'); 로 꺼내 쓸 수 있게 내보내는 작업
module.exports = { sequelize, User, Post, Theme, ThemeReview, Comment };
