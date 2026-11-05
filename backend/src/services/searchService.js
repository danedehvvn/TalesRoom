const searchRepository = require('../repositories/searchRepository');

function createHttpError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;

    return error;
}

// S-01 검색어 자동완성
async function getSuggestions(query = {}) {
    // 1. q가 문자열이면 앞뒤 공백 제거
    const keyword =
        typeof query.q === 'string'
            ? query.q.trim()
            : '';

    // 2. 검색어는 한 글자 이상 필요
    if (keyword.length < 1) {throw createHttpError(400,'검색어를 입력해주세요.' );}

    // 3. limit 기본값은 5
    const DEFAULT_LIMIT = 5;
    
    const limit =
        query.limit === undefined
            ? DEFAULT_LIMIT
            : Number(query.limit);

    if (
        !Number.isInteger(limit) ||
        limit < 1 ||
        limit > DEFAULT_LIMIT
    ) {
        throw createHttpError(400,'limit는 1 이상 5 이하의 정수여야 합니다.');
    }

    // 4. 게시글 제목과 테마명을 동시에 검색
    return searchRepository.findSuggestions(keyword, limit);
}

module.exports = { getSuggestions};