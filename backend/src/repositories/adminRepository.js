const { User } = require('../models');

// 회원 목록 한 페이지 + 전체 회원 수
async function findUsers({ limit, offset }) {
    return User.findAndCountAll({
        attributes: [['id', 'userId'], 'email', 'nickname', 'role', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit,
        offset,

    });
}

module.exports = { findUsers };