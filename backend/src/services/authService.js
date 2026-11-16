// 인증(회원가입, 로그인 등) 관련 서비스
// 지금은 아이디, 이메일, 닉네임 중복 검사 함수만 추가
// 회원가입(authController)과 내 정보 수정(userService)에서 함께 사용
const { Op } = require('sequelize');
const { User } = require('../models');

// 값이 비어 있는지 확인 (문자열이 아니거나 공백만 있으면 비어 있는 것으로 봄)
const isEmpty = (value) => typeof value !== 'string' || !value.trim();

//excludeUserId는 내 정보 수정 시, 본인 아이디를 제외하고 중복 검사할 때 사용
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
const duplicateEmail = async (email) => {
    if (isEmpty(email)) {
        return { status: 400, message: '이메일을 입력해 주세요' };
    }
    const user = await User.findOne({ where: buildWhere('email', email), attributes: ['id'] });
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
