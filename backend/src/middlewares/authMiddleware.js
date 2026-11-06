// 로그인 확인 미들웨어(NFR-002: 인증이 필요한 API는 JWT 미들웨어로 검사)
// 사용 예) router.post('/', authMiddleware, postController.create);
// 통과하면 컨트롤러에서 req.user.id, req.user.role 로 로그인한 회원 정보
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    // 요청 헤더 형식: Authorization: Bearer <토큰>
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({ success: false, data: null, message: '로그인이 필요합니다.' });
    }

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer" || !token) {
        return res.status(401).json({ success: false, data: null, message: '잘못된 인증 방법 입니다.' });
    }

    try {
        //토큰이 위조되었거나 만료되었으면 에러
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({ success: false, data: null, message: '로그인이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.' });
    }
}

module.exports = authMiddleware;
