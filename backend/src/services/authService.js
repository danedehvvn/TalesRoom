// 인증(회원가입, 로그인 등) 관련 서비스
// 지금은 아이디, 이메일, 닉네임 중복 검사 함수가 들어 있다.
// 회원가입(authController)과 내 정보 수정(userService)에서 함께 사용한다.
//
// 세 함수 공통 규칙
//  - 문제가 있으면 { status, message } 를 돌려준다. (비어 있음, 중복 모두 400)
//  - 문제가 없으면 null 을 돌려준다.
//  - 두 번째 값 excludeUserId: 이 아이디를 가진 회원은 검사에서 뺀다. (내 정보 수정용)
//      예) 닉네임이 '홍길동'인 test01이 '홍길동' 그대로 저장해도 중복이 아니어야 한다.
//          → duplicateNickname('홍길동', 'test01')
//      회원가입처럼 뺄 사람이 없으면 생략한다. → duplicateNickname('홍길동')
const { Op } = require('sequelize');
const { User } = require('../models');

// 값이 비어 있는지 확인 (문자열이 아니거나 공백만 있으면 비어 있는 것으로 봄)
const isEmpty = (value) => typeof value !== 'string' || !value.trim();

// 검색 조건 만들기: { 필드: 값 } + (excludeUserId가 있으면) "id가 excludeUserId가 아닌 회원"
const buildWhere = (field, value, excludeUserId) => {
    const where = { [field]: value.trim() };
    if (excludeUserId) {
        where.id = { [Op.ne]: excludeUserId }; // Op.ne = "같지 않음"(not equal)
    }
    return where;
};

// 아이디 검사
const duplicateId = async (id) => {
    if (isEmpty(id)) {
        return { status: 400, message: '아이디를 입력해 주세요' };
    }
    // 아이디는 바꿀 수 없으므로 excludeUserId가 필요 없다
    const user = await User.findOne({ where: buildWhere('id', id), attributes: ['id'] });
    if (user) {
        return { status: 400, message: '이미 사용 중인 아이디입니다.' };
    }
    return null;
};

// 이메일 검사
const duplicateEmail = async (email, excludeUserId) => {
    if (isEmpty(email)) {
        return { status: 400, message: '이메일을 입력해 주세요' };
    }
    const user = await User.findOne({ where: buildWhere('email', email, excludeUserId), attributes: ['id'] });
    if (user) {
        return { status: 400, message: '이미 사용 중인 이메일입니다.' };
    }
    return null;
};

// 닉네임 검사
const duplicateNickname = async (nickname, excludeUserId) => {
    if (isEmpty(nickname)) {
        return { status: 400, message: '닉네임을 입력해 주세요' };
    }
    const user = await User.findOne({ where: buildWhere('nickname', nickname, excludeUserId), attributes: ['id'] });
    if (user) {
        return { status: 400, message: '이미 사용 중인 닉네임입니다.' };
    }
    return null;
};

module.exports = { isEmpty, duplicateId, duplicateEmail, duplicateNickname };
