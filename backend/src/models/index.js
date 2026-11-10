// 모델을 한 곳에 모으고, 모델 끼리의 관계를 정하는 작업

const sequelize = require('../config/db');      // DB 연결 객체
const User = require('./User');                 // 회원 모델
const Post = require('./Post');                 // 게시글 모델
const PostLog = require('./PostLog');
const Theme= require('./Theme');                // 테마 모델
const ThemeReview = require('./ThemeReview');   // 후기평점 모델
const Comment = require('./Comment');   // 댓글 모델
const PostReaction = require('./PostReaction');// 게시글 좋아요 모델
const Recruitment = require('./Recruitment');                       // 동행 모집글 모델
const RecruitmentApplication = require('./RecruitmentApplication'); // 모집 신청 모델
const PartyComment = require('./PartyComment');                     // 파티 글 댓글 모델

// 회원 1명 -> 글 여러개 (1:N)
User.hasMany(Post, { foreignKey: 'userId' });

// 글 1개 -> 작성자 1명 (N:1)
// as: 'author' -> 작성자 정보가 'author'라는 이름으로 들어감.
Post.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// + 수정 기록 여러개 (1:N)
Post.hasMany(PostLog, { foreignKey: 'postId' });

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
Post.hasMany(Comment, { foreignKey: 'postId', as :'comments'});
Comment.belongsTo(Post, { foreignKey: 'postId' });

// 회원 1명 -> 댓글 여러 개 (1:N)
User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// 게시글 1개 -> 좋아요 여러 개 (1:N)
// hasMany : 게시글과 좋아요의 관계에서 1쪽의 모델(Post)에서 N쪽의 모델(PostReactions)을 참조할 때 사용
// belongsTo : 게시글과 좋아요의 관계에서 N쪽의 모델(PostReactions)에서 1쪽의 모델(Post)을 참조할 때 사용
Post.hasMany(PostReaction, { foreignKey: 'postId', as: 'reactions' });//as: 'reactions' -> 게시글 상세에서 좋아요 정보를 전부 가지고 있는 배열 변수명(reactions)으로 들어감
PostReaction.belongsTo(Post, { foreignKey: 'postId' });

// 동행 모집 REQ-REC 회원 1 -> 모집글 N
User.hasMany(Recruitment, { foreignKey: 'userId' });
Recruitment.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// 테마 1 -> 모집글 N
Theme.hasMany(Recruitment, { foreignKey: 'themeId' });
Recruitment.belongsTo(Theme, { foreignKey: 'themeId', as: 'theme' });

// 모집글 1 -> 신청 N
Recruitment.hasMany(RecruitmentApplication, { foreignKey: 'recruitmentId', as: 'applications'});
RecruitmentApplication.belongsTo(Recruitment, { foreignKey: 'recruitmentId'});

// 회원 1 -> 신청 N
User.hasMany(RecruitmentApplication, { foreignKey: 'userId' });
RecruitmentApplication.belongsTo(User, { foreignKey: 'userId', as: 'applicant' });

// 파티 REQ-PRT
// 모집글 1 -> 파티글 N
Recruitment.hasMany(PartyComment, { foreignKey: 'recruitmentId', as: 'partyComments' });
PartyComment.belongsTo(Recruitment, { foreignKey: 'recruitmentId' });
PartyComment.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// 다른 파일에서 const { Post, User, PostLog, Theme, ThemeReview, Comment, PostReactions } = require('../models'); 로 꺼내 쓸 수 있게 내보내는 작업
module.exports = { sequelize, User, Post, PostLog, Theme, ThemeReview, Comment, PostReaction, Recruitment, RecruitmentApplication, PartyComment };
