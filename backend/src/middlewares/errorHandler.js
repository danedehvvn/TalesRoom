// 모든 컨트롤러에서 next(error)로 전달한 오류를 동일한 형식으로 응답한다.
function errorHandler(error, req, res, next) {
    if (res.headersSent) return next(error);

    const candidate = error.statusCode || error.status;
    const status = Number.isInteger(candidate) && candidate >= 400 && candidate <= 599
        ? candidate
        : 500;

    if (status >= 500) console.error(error);

    let message = status >= 500
        ? '서버 내부 오류가 발생했습니다.'
        : error.message || '요청을 처리할 수 없습니다.';
    if (error.type === 'entity.parse.failed') message = '올바른 JSON 형식으로 요청해 주세요.';

    return res.status(status).json({ success: false, data: null, message });
}

module.exports = errorHandler;
