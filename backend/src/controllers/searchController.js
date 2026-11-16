const searchService = require(
    '../services/searchService'
);


// 검색어 자동완성
// 입력 중 검색어가 포함된 글 제목, 테마명 추천 목록으로 바꿈
async function getSuggestions(req, res, next) {
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
        return next(error);
    }
}

module.exports = {
    getSuggestions
};