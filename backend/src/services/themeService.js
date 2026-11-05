const themeRepository = require('../repositories/themeRepository');

//1. 테마 목록 조회
const getThemes=async(page)=>{
  const limit= 10; //10개 페이징
  const offset = (page-1)*limit;

  const result = await themeRepository.findAllThemes(limit, offset); //{count, rows} 반환

  // Sequelize 모델 결과(result) → API 응답 객체로 변환
  const items = result.rows.map((theme) => {
    const t = theme.get({ plain: true });

    //JSON 응답 형식 맞춰서
    return {
      id: t.id,
      title: t.title,
      storeName: t.storeName,
      genre: t.genre,
      minPeople: t.minPeople,
      maxPeople: t.maxPeople,
      playTime: t.playTime,
      difficulty: t.difficulty,
      createdAt: t.createdAt,
    };
  });

  return{
    items, //변환된 배열
    pagination:{
      page,
      limit,
      totalCount: result.count, // 테마 총 개수
      totalPage: Math.ceil(result.count / limit) //페이지네이션 적용시 총 페이지
    }
  }
}

//2. 테마 상세 정보 조회
const getThemeById= async (id)=>{
  const theme= await themeRepository.findThemeById(id);

  if(!theme){ // 해당 아이디가 없으면
    const error = new Error('존재하지 않는 아이디의 테마입니다.');
    error.status=404;
    throw error;
  }

  return theme;
}


// 추가
function createHttpError(
    statusCode,
    message
) {
    const error = new Error(message);
    error.statusCode = statusCode;

    return error;
}

const INVALID_FILTER_MESSAGE = '잘못된 필터 값';

const INVALID_THEME_DATA_MESSAGE = '필수 값 누락 / 범위 오류';

const THEME_NOT_FOUND_MESSAGE = '테마를 찾을 수 없습니다.';

function parsePositiveInteger(value, defaultValue, statusCode, errorMessage) {
    if (value === undefined) {return defaultValue;}

    const parsedValue = Number(value);

    if (
        !Number.isInteger(parsedValue) ||
        parsedValue < 1
    ) {throw createHttpError(statusCode, errorMessage);}

    return parsedValue;
}

function normalizeOptionalString(value, statusCode, errorMessage) {
    if (value === undefined) { return undefined;}

    if (typeof value !== 'string') {throw createHttpError(statusCode, errorMessage);}

    const normalizedValue = value.trim();

    return normalizedValue || undefined;
}

// 관리자 권한 검사
function validateAdmin(authUser) {
    if (!authUser) {throw createHttpError(401,'로그인이 필요합니다.');}

    if (authUser.role !== 'ADMIN') {throw createHttpError(403, '관리자만 접근할 수 있습니다.');}
}

// 등록·수정 요청값 검사
function validateThemeData(body = {}) {
    if (
        body === null ||
        typeof body !== 'object' ||
        Array.isArray(body)
    ) {throw createHttpError(400, INVALID_THEME_DATA_MESSAGE);}

    const storeNameValue =
        body.storeName !== undefined
            ? body.storeName
            : body.branchName;

    const requiredStrings = {
        title: body.title,
        storeName: storeNameValue,
        address: body.address,
        content: body.content,
        genre: body.genre
    };

    for (const value of Object.values(requiredStrings)) {
        if (
            typeof value !== 'string' ||
            value.trim().length === 0
        ) {
            throw createHttpError(
                400,
                INVALID_THEME_DATA_MESSAGE
            );
        }
    }

    const title = body.title.trim();

    const storeName = storeNameValue.trim();

    const address = body.address.trim();

    const content = body.content.trim();

    const genre = body.genre.trim();

    if (title.length > 150) {throw createHttpError(400, INVALID_THEME_DATA_MESSAGE);}

    if (storeName.length > 100) {throw createHttpError(400, INVALID_THEME_DATA_MESSAGE);}

    if (address.length > 255) {throw createHttpError(400, INVALID_THEME_DATA_MESSAGE);}

    if (genre.length > 50) {
        throw createHttpError(
            400,
            INVALID_THEME_DATA_MESSAGE
        );
    }

    if (
        body.mapUrl !== undefined &&
        body.mapUrl !== null &&
        typeof body.mapUrl !== 'string'
    ) {
        throw createHttpError(
            400,
            INVALID_THEME_DATA_MESSAGE
        );
    }

    const mapUrl =
        body.mapUrl === undefined ||
        body.mapUrl === null
            ? null
            : body.mapUrl.trim();

    if (
        mapUrl !== null &&
        mapUrl.length > 500
    ) {
        throw createHttpError(
            400,
            INVALID_THEME_DATA_MESSAGE
        );
    }

    const minPeople =
        body.minPeople === undefined
            ? 1
            : Number(body.minPeople);

    const playTime =
        body.playTime === undefined
            ? 60
            : Number(body.playTime);

    const maxPeople =
        Number(body.maxPeople);

    const difficulty =
        Number(body.difficulty);

    const price =
        Number(body.price);

    if (
        !Number.isInteger(minPeople) ||
        minPeople < 1
    ) {
        throw createHttpError(
            400,
            INVALID_THEME_DATA_MESSAGE
        );
    }

    if (
        !Number.isInteger(maxPeople) ||
        maxPeople < minPeople
    ) {
        throw createHttpError(
            400,
            INVALID_THEME_DATA_MESSAGE
        );
    }

    if (
        !Number.isInteger(playTime) ||
        playTime < 1
    ) {
        throw createHttpError(
            400,
            INVALID_THEME_DATA_MESSAGE
        );
    }

    if (
        !Number.isInteger(difficulty) ||
        difficulty < 1 ||
        difficulty > 5
    ) {
        throw createHttpError(
            400,
            INVALID_THEME_DATA_MESSAGE
        );
    }

    if (
        !Number.isInteger(price) ||
        price < 0
    ) {
        throw createHttpError(
            400,
            INVALID_THEME_DATA_MESSAGE
        );
    }

    return {title,storeName,address,mapUrl,content,minPeople,maxPeople,playTime,difficulty,price,genre};
}

// T-01 테마 목록·복합 필터
async function getFilteredThemes(query = {}) {
    const page = parsePositiveInteger(query.page,1,400,INVALID_FILTER_MESSAGE);

    const size = parsePositiveInteger( query.size,10,400,INVALID_FILTER_MESSAGE);

    const people =
        query.people === undefined
            ? undefined
            : parsePositiveInteger(query.people,undefined,400,INVALID_FILTER_MESSAGE);

    const filters = {
        keyword: normalizeOptionalString(query.keyword,400, INVALID_FILTER_MESSAGE ),

        region: normalizeOptionalString(query.region,400, INVALID_FILTER_MESSAGE),

        people,

        genre: normalizeOptionalString(query.genre, 400, INVALID_FILTER_MESSAGE)
    };

    const offset = (page - 1) * size;

    const [rows, totalCount] =
        await Promise.all([
            themeRepository.findAll(filters, size, offset),

            themeRepository.countAll(filters)]);

    const items = rows.map((row) => ({
        id: row.id,
        title: row.title,
        storeName: row.storeName,
        genre: row.genre,
        difficulty: Number(row.difficulty),
        minPeople: Number(row.minPeople),
        maxPeople: Number(row.maxPeople),
        price: Number(row.price),
        imageUrl: null,
        avgRating: Number(row.avgRating),
        reviewCount: Number(row.reviewCount)
    }));

    return {items, page, size, totalCount, totalPages: Math.ceil(totalCount / size)};
}

// M-01 관리자 테마 등록
async function createTheme(authUser, body) {
    validateAdmin(authUser);

    const themeData = validateThemeData(body);

    const id = await themeRepository.create(authUser.id, themeData);

    return {id};
}

// M-02 관리자 테마 수정
async function updateTheme(authUser, idValue, body) {
    validateAdmin(authUser);

    const id = parsePositiveInteger(idValue, undefined, 404, THEME_NOT_FOUND_MESSAGE);

    const themeData = validateThemeData(body);

    const updatedId =
        await themeRepository.updateWithLog(id, authUser.id, themeData);

    if (!updatedId) {throw createHttpError(404, THEME_NOT_FOUND_MESSAGE);}

    return {id: updatedId};
}

// M-03 관리자 테마 삭제
async function deleteTheme(authUser, idValue) {
    validateAdmin(authUser);

    const id = parsePositiveInteger(idValue, undefined, 404, THEME_NOT_FOUND_MESSAGE);

    const deleted = await themeRepository.deleteById(id);

    if (!deleted) {throw createHttpError(404, THEME_NOT_FOUND_MESSAGE);}
}

module.exports = { getThemes, getThemeById, getFilteredThemes, createTheme, updateTheme, deleteTheme};