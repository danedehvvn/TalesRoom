const searchService = require(
    '../services/searchService'
);

function sendErrorResponse(res, error) {
    const statusCode =
        error.statusCode || 500;

    console.error(error);

    return res.status(statusCode).json({
        success: false,
        data: null,
        message:
            statusCode === 500
                ? '서버 내부 오류가 발생했습니다.'
                : error.message
    });
}

// 검색어 자동완성
// 입력 중 검색어가 포함된 글 제목, 테마명 추천 목록으로 바꿈
async function getSuggestions(req, res) {
    try {
        const data =
            await searchService.getSuggestions(
                req.query
            );

        return res.status(200).json({
            success: true,
            data,
            message: 'OK'
        });
    } catch (error) {
        return sendErrorResponse(
            res,
            error
        );
    }
}

module.exports = {
    getSuggestions
};