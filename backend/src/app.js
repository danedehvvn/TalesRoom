require('dotenv').config();             // 불러오기
const express = require('express');     // 웹 서버 만드는 도구
const cors = require('cors');           // 다른 주소에서 오는 요청 허용
const sequelize = require('./config/db');   // 팀원이 만든 DB 연결 객체

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




// 서버 확인용 주소
// http://localhost:3000/
app.get('/', (req, res) => {
    res.json({ success: true, data:null, message: 'TalesRoom API' });
})

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