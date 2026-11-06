const { QueryTypes } = require("sequelize"); 
const {sequelize, Post, User} = require("../models");

// 내 정보 조회
const findById = async (userId) => {
  return User.findByPk(userId, {
    attributes: [
      ["id", "userId"],
      "email",
      "nickname",
      "role",
      "createdAt"
    ],
    raw: true
  });
};

// 비밀번호 변경 시 내부적으로 사용
const findPasswordById = async (userId) => {
  return User.findByPk(userId, {
    attributes: [
      ["id", "userId"],
      "password"
    ],
    raw: true
  });
};

// 닉네임 중복 확인
const findByNickname = async (nickname) => {
  return User.findOne({
    where: {
      nickname
    },
    attributes: [
      ["id", "userId"]
    ],
    raw: true
  });
};

// 이메일 중복 확인 (findByNickname과 같은 방식, 회원 아이디만 조회)
const findByEmail = async (email) => {
  return User.findOne({
    where: {
      email
    },
    attributes: [
      ["id", "userId"]
    ],
    raw: true
  });
};

// 닉네임·비밀번호 변경
const update = async (
  userId,
  updateData
) => {
  const [updatedCount] = await User.update(
    updateData,
    {
      where: {
        id: userId
      }
    }
  );

  return updatedCount;
};

// 내가 쓴 글
const findMyPosts = async (
  userId,
  size,
  offset
) => {
  return sequelize.query(
    `SELECT
       p.id,
       p.category,
       p.title,

       u.id AS \`author.userId\`,
       u.nickname AS \`author.nickname\`,

       p.view_count AS viewCount,

       (
         SELECT COUNT(*)
         FROM post_reactions AS pr
         WHERE pr.post_id = p.id
       ) AS likeCount,

       (
         SELECT COUNT(*)
         FROM comments AS c
         WHERE c.post_id = p.id
       ) AS commentCount,

       CASE
         WHEN EXISTS (
           SELECT 1
           FROM comments AS accepted_comment
           WHERE accepted_comment.post_id = p.id
             AND accepted_comment.is_accepted = 1
         )
         THEN 1
         ELSE 0
       END AS isSolved,

       p.is_spoiler AS isSpoiler,
       p.created_at AS createdAt

     FROM posts AS p

     INNER JOIN users AS u
       ON u.id = p.user_id

     WHERE p.user_id = :userId

     ORDER BY
       p.created_at DESC,
       p.id DESC

     LIMIT :size
     OFFSET :offset`,
    {
      replacements: {
        userId,
        size: Number(size),
        offset: Number(offset)
      },
      type: QueryTypes.SELECT,
      nest: true
    }
  );
};

const countMyPosts = async (userId) => {
  //totalcount 와 totlapages 계산
  return Post.count({
    where: {
      userId
    }
  });
};

// 내가 쓴 댓글
const findMyComments = async (
  userId,
  size,
  offset
) => {
  return sequelize.query(
    `SELECT
       c.id,
       c.post_id AS postId,
       p.title AS postTitle,
       c.content,
       c.is_accepted AS isAccepted,
       c.created_at AS createdAt

     FROM comments AS c

     INNER JOIN posts AS p
       ON p.id = c.post_id

     WHERE c.user_id = :userId

     ORDER BY
       c.created_at DESC,
       c.id DESC

     LIMIT :size
     OFFSET :offset`,
    {
      replacements: {
        userId,
        size: Number(size),
        offset: Number(offset)
      },
      type: QueryTypes.SELECT
    }
  );
};

const countMyComments = async (userId) => {
  const rows = await sequelize.query(
    `SELECT COUNT(*) AS totalCount
     FROM comments
     WHERE user_id = :userId`,
    {
      replacements: {
        userId
      },
      type: QueryTypes.SELECT
    }
  );

  // count 문자열이면 숫자로 바꾸기
  return Number(rows[0].totalCount);
};

module.exports = {
  findById,
  findPasswordById,
  findByNickname,
  findByEmail,
  update,
  findMyPosts,
  countMyPosts,
  findMyComments,
  countMyComments
};