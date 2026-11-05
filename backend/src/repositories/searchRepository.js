const {
    QueryTypes
} = require('sequelize');

const {
    sequelize
} = require('../models');

// 게시글·테마 검색 자동완성
async function findSuggestions(
    keyword,
    limit
) {
    // LIKE 검색에 사용할 값
    const likeKeyword = `%${keyword}%`;

    // 게시글과 테마 검색을 동시에 실행
    const [posts, themes] =
        await Promise.all([
            sequelize.query(
                `SELECT
                   id,
                   title
                 FROM posts
                 WHERE title LIKE :keyword
                   AND is_notice = 0
                 ORDER BY
                   created_at DESC,
                   id DESC
                 LIMIT :limit`,
                {
                    replacements: {
                        keyword: likeKeyword,
                        limit: Number(limit)
                    },
                    type: QueryTypes.SELECT
                }
            ),

            sequelize.query(
                `SELECT
                   id,
                   title
                 FROM themes
                 WHERE title LIKE :keyword
                 ORDER BY
                   created_at DESC,
                   id DESC
                 LIMIT :limit`,
                {
                    replacements: {
                        keyword: likeKeyword,
                        limit: Number(limit)
                    },
                    type: QueryTypes.SELECT
                }
            )
        ]);

    return {
        posts,
        themes
    };
}

module.exports = {
    findSuggestions
};