const {
    QueryTypes
} = require('sequelize');

const {
    sequelize,
    Theme
} = require('../models');

// 추가 구현 필요: 후기 평균 별점 계산 및 후기 총 개수 조회, 다중 필터 검색

// 1. 테마 목록 조회 (최신순. 매장명, 테마명, 장르, 최소~최대 인원수, 플레이타임, 난이도 조회)
const findAllThemes= async (limit, offset)=>{
  return await Theme.findAndCountAll({
    limit,
    offset,

    attributes: ['id', 'storeName', 'title', 'genre', 'minPeople', 'maxPeople', 'playTime', 'difficulty', 'createdAt'],

    order:[['createdAt','DESC']]
  });
}

// 2. 테마 상세 정보 조회
const findThemeById=async(id)=>{
  return await Theme.findByPk(id);
}

//복합 필터링
function buildWhereClause(filters) {
    const conditions = [];
    const replacements = {};

    if (filters.keyword !== undefined) {
        conditions.push(`(
            t.title LIKE :keyword
            OR t.store_name LIKE :keyword
        )`);

        replacements.keyword =
            `%${filters.keyword}%`;
    }

    if (filters.region !== undefined) {
        conditions.push(`(
            t.address LIKE :region
            OR t.store_name LIKE :region
        )`);

        replacements.region =
            `%${filters.region}%`;
    }

    if (filters.people !== undefined) {
        conditions.push(`
            t.min_people <= :people
            AND t.max_people >= :people
        `);

        replacements.people =
            filters.people;
    }

    if (filters.genre !== undefined) {
        conditions.push(
            't.genre = :genre'
        );

        replacements.genre =
            filters.genre;
    }

    const whereClause =
        conditions.length > 0
            ? `WHERE ${conditions.join(' AND ')}`
            : '';

    return {
        whereClause,
        replacements
    };
}

//t-01
async function findAll(
    filters,
    size,
    offset
) {
    const {
        whereClause,
        replacements
    } = buildWhereClause(filters);

    return sequelize.query(
        `SELECT
           t.id,
           t.title,
           t.store_name AS storeName,
           t.genre,
           t.difficulty,
           t.min_people AS minPeople,
           t.max_people AS maxPeople,
           t.play_time AS playTime,
           t.price,
           t.thumbnail_url AS thumbnailUrl,
           t.created_at AS createdAt,

           COALESCE(
               ROUND(AVG(tr.rating), 1),
               0
           ) AS avgRating,

           COUNT(tr.id) AS reviewCount

         FROM themes AS t

         LEFT JOIN theme_reviews AS tr
           ON tr.theme_id = t.id

         ${whereClause}

         GROUP BY
           t.id,
           t.title,
           t.store_name,
           t.genre,
           t.difficulty,
           t.min_people,
           t.max_people,
           t.play_time,
           t.price,
           t.thumbnail_url,
           t.created_at

         ORDER BY
           t.created_at DESC,
           t.id DESC

         LIMIT :size
         OFFSET :offset`,
        {
            replacements: {
                ...replacements,
                size: Number(size),
                offset: Number(offset)
            },
            type: QueryTypes.SELECT
        }
    );
}


//전체개수
async function countAll(filters) {
    const {
        whereClause,
        replacements
    } = buildWhereClause(filters);

    const rows =
        await sequelize.query(
            `SELECT COUNT(*) AS totalCount
             FROM themes AS t
             ${whereClause}`,
            {
                replacements,
                type: QueryTypes.SELECT
            }
        );

    return Number(
        rows[0].totalCount
    );
}

//관리자 등록
async function create(
    userId,
    themeData
) {
    const [insertId] =
        await sequelize.query(
            `INSERT INTO themes (
                user_id,
                title,
                store_name,
                address,
                latitude,
                longitude,
                content,
                min_people,
                max_people,
                play_time,
                difficulty,
                price,
                genre,
                thumbnail_url,
                created_at
            ) VALUES (
                :userId,
                :title,
                :storeName,
                :address,
                :latitude,
                :longitude,
                :content,
                :minPeople,
                :maxPeople,
                :playTime,
                :difficulty,
                :price,
                :genre,
                :thumbnailUrl,
                NOW()
            )`,
            {
                replacements: {
                    userId,
                    ...themeData
                },
                type:
                    QueryTypes.INSERT
            }
        );

    return insertId;
}

// 관리자 수정 로그 저장
async function updateWithLog(
    id,
    editorUserId,
    themeData
) {
    return sequelize.transaction(
        async (transaction) => {
            const rows =
                await sequelize.query(
                    `SELECT
                       id,
                       user_id AS userId,
                       title,
                       store_name AS storeName,
                       address,
                       latitude,
                       longitude,
                       content,
                       min_people AS minPeople,
                       max_people AS maxPeople,
                       play_time AS playTime,
                       difficulty,
                       price,
                       genre,
                       thumbnail_url AS thumbnailUrl
                     FROM themes
                     WHERE id = :id
                     FOR UPDATE`,
                    {
                        replacements: {
                            id
                        },
                        type:
                            QueryTypes.SELECT,
                        transaction
                    }
                );

            const previousTheme =
                rows[0];

            if (!previousTheme) {
                return null;
            }

            await sequelize.query(
                `INSERT INTO theme_logs (
                    theme_id,
                    user_id,
                    title,
                    store_name,
                    address,
                    latitude,
                    longitude,
                    content,
                    min_people,
                    max_people,
                    play_time,
                    difficulty,
                    price,
                    genre,
                    thumbnail_url,
                    created_at
                ) VALUES (
                    :themeId,
                    :editorUserId,
                    :title,
                    :storeName,
                    :address,
                    :latitude,
                    :longitude,
                    :content,
                    :minPeople,
                    :maxPeople,
                    :playTime,
                    :difficulty,
                    :price,
                    :genre,
                    :thumbnailUrl,
                    NOW()
                )`,
                {
                    replacements: {
                        themeId:
                            previousTheme.id,
                        editorUserId,
                        title:
                            previousTheme.title,
                        storeName:
                            previousTheme.storeName,
                        address:
                            previousTheme.address,
                        latitude: previousTheme.latitude,
                        longitude: previousTheme.longitude,
                        content:
                            previousTheme.content,
                        minPeople:
                            previousTheme.minPeople,
                        maxPeople:
                            previousTheme.maxPeople,
                        playTime:
                            previousTheme.playTime,
                        difficulty:
                            previousTheme.difficulty,
                        price:
                            previousTheme.price,
                        genre:
                            previousTheme.genre,
                        thumbnailUrl: 
                            previousTheme.thumbnailUrl,
                    },
                    type:
                        QueryTypes.INSERT,
                    transaction
                }
            );

            await sequelize.query(
                `UPDATE themes
                 SET
                   title = :title,
                   store_name = :storeName,
                   address = :address,
                   latitude = :latitude,
                   longitude = :longitude,
                   content = :content,
                   min_people = :minPeople,
                   max_people = :maxPeople,
                   play_time = :playTime,
                   difficulty = :difficulty,
                   price = :price,
                   genre = :genre,
                   thumbnail_url = :thumbnailUrl,
                   updated_at = NOW()
                 WHERE id = :id`,
                {
                    replacements: {
                        id,
                        ...themeData
                    },
                    type:
                        QueryTypes.UPDATE,
                    transaction
                }
            );

            return id;
        }
    );
}

//관리자 삭제
async function deleteById(id) {
    return sequelize.transaction(
        async (transaction) => {
            const rows =
                await sequelize.query(
                    `SELECT id
                     FROM themes
                     WHERE id = :id
                     FOR UPDATE`,
                    {
                        replacements: {
                            id
                        },
                        type:
                            QueryTypes.SELECT,
                        transaction
                    }
                );

            if (!rows[0]) {
                return false;
            }

            await sequelize.query(
                `DELETE FROM themes
                 WHERE id = :id`,
                {
                    replacements: {
                        id
                    },
                    type:
                        QueryTypes.DELETE,
                    transaction
                }
            );

            return true;
        }
    );
}

module.exports = { findAllThemes, findThemeById, findAll, countAll, create, updateWithLog, deleteById};
