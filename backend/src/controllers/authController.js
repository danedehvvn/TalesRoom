const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');// 로그인 토큰(JWT) 발급
const { User } = require('../models');    
const { Op } = require('sequelize');    

// 회원 가입 컨트롤러
exports.signup = async (req, res) => {
    try {
        // 요청 본문에서 필요한 데이터 추출
        const { id, password, email, nickname, role } = req.body;

        // 1. 필수 입력 값 확인
        if (!id || !password || !email || !nickname) {
            // 누락 된 값 있으면 400 에러 응답 반환
            return res.status(400).json({ message: '모든 필드를 입력해주세요!' });
        }

        // 2. 아이디, 이메일, 닉네임 중복 검사 
        const existingUser = await User.findOne({
            where: {
                // 아이디, 이메일, 닉네임 중 하나라도 일치하는 사용자가 있는지 검색 
                [Op.or]: [{ id }, { email }, { nickname }]
            }
        });

        // 이미 존재하는 사용자라면 409 에러 응답 반환
        if (existingUser) {
            if(existingUser.id === id) {
                return res.status(409).json({ message: '이미 존재하는 아이디입니다!' });
            }
            if(existingUser.email === email) {
                return res.status(409).json({ message: '이미 존재하는 이메일입니다!' });
            }
            if(existingUser.nickname === nickname) {
                return res.status(409).json({ message: '이미 존재하는 닉네임입니다!' });
            }
        }

        // 3. 비밀번호 보안 암호화
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 4. 데이터베이스에 새로운 사용자 생성 및 저장 
        await User.create({
            id,
            password: hashedPassword,   // 암호화 비밀번호 저장
            email,
            nickname,
            role: role || 'null'        // 권한 값이 없으면 null(일반 회원), 있으면 해당 값 저장
        });

        // 5. 회원 가입 성공 응답 반환
        res.status(201).json({ message: '회원 가입이 완료되었습니다!' });

    } catch (error) {
        // 500 에러 응답 반환
        console.error('회원 가입 중 오류 발생:', error);
        res.status(500).json({ message: '서버 내부 오류가 발생했습니다!' });
    }
}

// 로그인 컨트롤러 (REQ-USR-004)
exports.login = async (req, res) => {
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
                user: { id: user.id, nickname: user.nickname, email: user.email, role: user.role },
            },
            message: '로그인되었습니다.',
        });
    } catch (error) {
        console.error('로그인 중 오류 발생:', error);
        res.status(500).json({ success: false, data: null, message: '서버 내부 오류가 발생했습니다!' });
    }
}
