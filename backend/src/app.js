require('dotenv').config();             // 불러오기
const express = require('express');     // 웹 서버 만드는 도구
const cors = require('cors');           // 다른 주소에서 오는 요청 허용
const sequelize = require('./config/db');   // 팀원이 만든 DB 연결 객체
const errorHandler = require('./middlewares/errorHandler');

// 서버 객체 만들기
const app = express();

// 미들웨어 : 요청이 거쳐가는 관문
app.use(cors({ origin: 'http://localhost:5173' })); // 프론트 React
app.use(express.json());                            // 본문에 담긴 JSON 읽기

// 라우터 불러오기
const authRouter = require('./routes/authRoutes');
app.use('/api/auth', authRouter);// 인증 라우터 등록
// 라우터 불러오기
const userRouter = require('./routes/userRouter');
// 라우터 등록
app.use('/api/users', userRouter);

const searchRouter = require('./routes/searchRouter');
app.use('/api/search', searchRouter);

const themeRouter = require('./routes/themeRouter');
app.use('/api/themes', themeRouter);

// 라우터 등록
// app.use('/api/posts', postRouter);

const postRouter = require('./routes/postRouter');  // 게시글 라우터 가져오기
app.use('/api/posts', postRouter);                  // /api/posts로 시작하는 요청은 전부 postRouter가 처리

const commentRouter = require('./routes/commentRouter');
app.use('/api', commentRouter);

// !!임시 비활성화!! exchangeService 복구 후 주석 해제 필요
const exchangeRouter = require('./routes/exchangeRouter');
app.use('/api/exchange', exchangeRouter);

const bookmarkRouter = require('./routes/bookmarkRouter');
app.use('/api/bookmarks', bookmarkRouter)

const adminRouter = require('./routes/adminRouter');
app.use('/api/admin', adminRouter);

const recruitmentRouter = require('./routes/recruitmentRouter');
app.use('/api/recruitments', recruitmentRouter);

const partyRouter = require('./routes/partyRouter');
app.use('/api/parties', partyRouter);

// 서버 확인용 주소
// http://localhost:3000/
app.get('/', (req, res) => {
    res.json({ success: true, data: null, message: 'TalesRoom API' });
})

// 등록되지 않은 API 경로도 공통 JSON 오류 형식으로 응답한다.
app.use((req, res, next) => {
    const error = new Error('요청한 경로를 찾을 수 없습니다.');
    error.status = 404;
    next(error);
});
app.use(errorHandler);

// 포트번호
const PORT = process.env.PORT || 3000;

// DB 접속 후 서버 ON
sequelize.authenticate()
    .then(() => {
        console.log('DB 연결 성공');
        app.listen(PORT, () => console.log(`서버 실행: http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error('DB 연결 실패', err.message);
    });
