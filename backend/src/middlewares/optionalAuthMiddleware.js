const authMiddleware = require('./authMiddleware');

// 공개 조회는 비로그인도 허용하고, 토큰이 있으면 기존 인증 로직으로 검증한다.
function optionalAuthMiddleware(req, res, next) {
    if (!req.headers.authorization) return next();
    return authMiddleware(req, res, next);
}

module.exports = optionalAuthMiddleware;
