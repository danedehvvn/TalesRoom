const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');// 로그인 토큰(JWT) 발급
const { User } = require('../models');
const { isEmpty, duplicateId, duplicateEmail, duplicateNickname } = require('../services/authService'); // 중복 검사 함수
const { isVerified, clearVerification } = require('../services/emailVerificationService');//회원가입시 이메일 인증 확인,삭제 함수
const { isValidPassword, PASSWORD_RULE_MESSAGE } = require('../utils/validators');// 비밀번호 규칙 검사·안내 문구 가져옴

// 회원 가입 컨트롤러
const signup = async(req, res, next)=>{
    try {
        // 요청 본문에서 필요한 데이터 추출
        const { id, password, email, nickname } = req.body;

        // 1. 필수 입력 값 확인
        if (!id || !password || !email || !nickname) {
            // 누락 된 값 있으면 400 에러 응답 반환
            return res.status(400).json({ message: '모든 필드를 입력해주세요!' });
        }

        // 비밀번호 규칙 확인
        if (!isValidPassword(password)) {
            return res.status(400).json({ message: `비밀번호는 ${PASSWORD_RULE_MESSAGE}` });
        }

        // 2. 아이디 → 이메일 → 닉네임 순서로 중복 검사 (authService의 세 함수 사용)
        let error = await duplicateId(id);
        if (!error) error = await duplicateEmail(email);
        if (!error) error = await duplicateNickname(nickname);

        // 문제가 있으면 그 상태코드와 메시지로 응답 (비어 있음, 중복 모두 400)
        if (error) {
            return res.status(error.status).json({ message: error.message });
        }

        //이메일 인증을 했는지 확인 (POST /api/auth/signup/verify 성공 후 10분 안이어야 함)
        if (!isVerified(email.trim(), 'signup')) {//인증 완료 여부 확인
            return res.status(400).json({ message: '이메일 인증을 완료해 주세요.' });
        }

        // 3. 비밀번호 보안 암호화
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 4. 데이터베이스에 새로운 사용자 생성 및 저장 
        await User.create({
            id: id.trim(),
            password: hashedPassword,   // 암호화 비밀번호 저장
            email: email.trim(),
            nickname: nickname.trim(),
            //role은 넣지 않는다 → DB에 NULL로 저장되고, NULL이면 일반 회원
            //최초 관리자는 DB에서 직접 'ADMIN'으로 지정 부여한다
        });

        //가입이 끝났으니 인증 기록 삭제 (같은 인증으로 또 가입하지 못하게)
        clearVerification(email.trim(), 'signup');

        // 5. 회원 가입 성공 응답 반환
        res.status(201).json({ message: '회원 가입이 완료되었습니다!' });

    } catch (error) {
        return next(error);
    }
}

// 로그인 컨트롤러 (REQ-USR-004)
const login = async(req, res, next)=>{
    try {
        const { id, password } = req.body;

        // 1. 필수 입력 값 확인
        if (!id || !password) {
            return res.status(400).json({ success: false, data: null, message: '아이디와 비밀번호를 입력해주세요!' });
        }

        // 2. 아이디로 회원 찾기
        const user = await User.findByPk(id);

        // 3. 비밀번호 비교
        const isMatch = user ? await bcrypt.compare(password, user.password) : false;// user가 존재하면 비밀번호 비교, 없으면 false
        if (!isMatch) {
            return res.status(401).json({ success: false, data: null, message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
        }

        // 비밀번호 확인하여 로그인 가능 시점
        // 4. JWT 발급(토큰 안에 회원 아이디와 권한 부여)
        const token = jwt.sign(
            { 
                id: user.id, role: user.role 
            },
            process.env.JWT_SECRET,
            { 
                expiresIn: process.env.JWT_EXPIRES_IN || '2h' 
            }
        );

        // 5. 로그인 성공 응답 (화면에 보여줄 기본 회원 정보도 함께 보냄)
        res.status(200).json({
            success: true,
            data: {
                token,
                user: { id: user.id, nickname: user.nickname, email: user.email, role: user.role, score: user.score, grade: user.grade },
            },
            message: '로그인되었습니다.',
        });
    } catch (error) {
        return next(error);
    }
}

// 중복 검사 컨트롤러 (회원가입 전 확인용): 아이디 → 이메일 → 닉네임 순서로 검사
// 검사 함수들은 services/authService.js 에 있다
const duplicate = async (req, res, next) => {
    try {
        const { id, email, nickname } = req.body || {};//body 없이 요청이 와도 에러 나지 않게

        // 1. 세 값이 모두 비어 있으면 입력 요청
        if (isEmpty(id) && isEmpty(email) && isEmpty(nickname)) {
            return res.status(400).json({ success: false, data: null, message: '입력해 주세요' });
        }

        // 2. 순서대로 검사(먼저 발생한 문제만 응답)
        let error = await duplicateId(id);
        if (!error) error = await duplicateEmail(email);
        if (!error) error = await duplicateNickname(nickname);

        // 3. 문제가 있으면 그 상태코드와 메시지로 응답
        if (error) {
            return res.status(error.status).json({ success: false, data: null, message: error.message });
        }

        // 4. 세 값 모두 정상
        res.status(200).json({ success: true, data: null, message: '사용 가능한 아이디, 이메일, 닉네임입니다.' });
    } catch (error) {
        return next(error);
    }
};

module.exports = { signup, login, duplicate };
