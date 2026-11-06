// 로그인 확인 미들웨어 (테스트용 우회 기능 포함)
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    // ==========================================
    // [임시 테스트용] 토큰 없이 편하게 테스트하고 싶을 때 아래 주석을 푸세요!
    // 테스트가 끝나면 아래 블록을 다시 주석 처리하시면 됩니다.
    // ==========================================
    
    req.user = {
        id: 1,               // 테스트할 유저의 고유 번호 (숫자 또는 문자열)
        userId: "testUser",  // 유저 아이디
        role: "USER"         // 권한 (관리자 권한 테스트가 필요하면 "ADMIN"으로 변경)
    };
    return next(); // 토큰 검증을 건너뛰고 바로 다음 단계로 통과!
    
    // ==========================================

    /* --- 원래의 토큰 검증 로직 (테스트 완료 후 복구용) ---
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({ success: false, data: null, message: '로그인이 필요합니다.' });
    }

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer" || !token) {
        return res.status(401).json({ success: false, data: null, message: '잘못된 인증 방법 입니다.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, data: null, message: '로그인이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.' });
    }
    --------------------------------------------------- */
}

module.exports = authMiddleware;