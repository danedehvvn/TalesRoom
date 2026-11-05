const { Theme } = require('../models');       


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


module.exports = { findAllThemes, findThemeById };