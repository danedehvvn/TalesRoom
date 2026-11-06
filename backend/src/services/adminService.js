const adminRepository = require('../repositories/adminRepository');

// query = req.query ( 주소에서 ?page=2&size=10 ). 값은 전부 문자열로 들어옴
async function getUsers(query) {
    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const size = Math.min(Math.max(parseInt(query.size, 10) || 10, 1), 50);
    const offset = (page - 1) * size;

    const result = await adminRepository.findUsers({ limit: size, offset });

    return { // get({ plan: true}) = Sequelize 모델 객체 -> 순수 데이터 객체
            items: result.rows.map((user) => user.get({ plain: true })),
            page,
            size,
            totalCount: result.count,
            totalPages: Math.ceil(result.count / size),
    };
}

module.exports = { getUsers };