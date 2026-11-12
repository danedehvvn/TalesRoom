const { User, sequelize } = require('../models');
const exchangeRepository = require('../repositories/exchangeRepository');

// 1. 전체 상품 목록 조회
const getItems = async () => {
  return await exchangeRepository.findAllItems();
};

// 2. 상품 교환 처리 (quantity 삭제, 1개 단가 기준 적용)
const exchangeItem = async (userId, body) => {
  const { itemId } = body;

  // 트랜잭션 시작
  const t = await sequelize.transaction();

  try {
    // 유저 정보 및 상품 정보 조회 (트랜잭션 적용)
    const user = await User.findByPk(userId, { transaction: t });
    const item = await exchangeRepository.findItemById(itemId);

    if (!user) {
      const error = new Error("존재하지 않는 사용자입니다.");
      error.status = 404;
      throw error;
    }

    // 상품 존재 여부 및 재고 확인
    if (!item || item.stock <= 0) {
      const error = new Error("존재하지 않거나 품절된 상품입니다.");
      error.status = 400;
      throw error;
    }

    // 포인트 및 점수 계산 (단가 price 기준)
    const totalUsedPoints = item.price;
    const CONVERSION_RATE = 10; // 1점 = 10P 환산 기준
    const availablePoints = (user.score || 0) * CONVERSION_RATE;

    if (availablePoints < totalUsedPoints) {
      const error = new Error("보유 포인트가 부족합니다.");
      error.status = 400;
      throw error;
    }

    // 유저 점수 차감 (10P당 1점 소모)
    const deductedScore = totalUsedPoints / CONVERSION_RATE;
    user.score -= deductedScore;
    await user.save({ transaction: t });

    // 교환 내역 생성 및 재고 차감 (repository 인자에서 quantity 제거)
    const exchange = await exchangeRepository.createExchangeAndReduceStock(userId, item, t);

    // 트랜잭션 커밋
    await t.commit();
    return exchange;

  } catch (error) {
    // 오류 발생 시 롤백
    await t.rollback();
    throw error;
  }
};

// 3. 내 교환 내역 조회
const getMyExchanges = async (userId) => {
  return await exchangeRepository.findExchangesByUserId(userId);
};

// 4. [관리자] 전체 교환 내역 조회
const getAllExchanges = async () => {
  return await exchangeRepository.findAllExchanges();
};

// [관리자] 상품 등록 비즈니스 로직
const createItem = async (itemData, userId) => {
  const { name, price, stock } = itemData;
  if (!userId) {
    const err = new Error("관리자 정보가 없습니다.");
    err.status = 401;
    throw err;
  }
  if (!name || price === undefined || stock === undefined) {
    const err = new Error("상품명, 가격, 재고는 필수 입력 항목입니다.");
    err.status = 400;
    throw err;
  }
  return await exchangeRepository.createItem({...itemData, userId });
};

// [관리자] 상품 수정 비즈니스 로직
const updateItem = async (itemId, itemData) => {
  const updated = await exchangeRepository.updateItem(itemId, itemData);
  if (!updated) {
    const err = new Error("해당 상품을 찾을 수 없습니다.");
    err.status = 404;
    throw err;
  }
  return updated;
};

// [관리자] 상품 삭제 비즈니스 로직
const deleteItem = async (itemId) => {
  const success = await exchangeRepository.deleteItem(itemId);
  if (!success) {
    const err = new Error("해당 상품을 찾을 수 없습니다.");
    err.status = 404;
    throw err;
  }
  return true;
};

module.exports = { getItems, exchangeItem, getMyExchanges, getAllExchanges, createItem, updateItem, deleteItem };