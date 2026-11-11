const { User, sequelize } = require('../models');
const exchangeRepository = require('../repositories/exchangeRepository');

// 1. 전체 상품 목록 조회
const getItems = async () => {
  return await exchangeRepository.findAllItems();
};

// 2. 상품 교환 처리 (트랜잭션 적용)
const exchangeItem = async (userId, body) => {
  const { itemId, quantity = 1 } = body;

  // 트랜잭션 시작
  const t = await sequelize.transaction();

  try {
    // 유저 정보 및 상품 정보 조회 (트랜잭션 잠금 적용)
    const user = await User.findByPk(userId, { transaction: t });
    const item = await exchangeRepository.findItemById(itemId);

    if (!user) {
      const error = new Error("존재하지 않는 사용자입니다.");
      error.status = 404;
      throw error;
    }

    if (!item) {
      const error = new Error("존재하지 않는 상품입니다.");
      error.status = 404;
      throw error;
    }

    if (item.stock < quantity) {
      const error = new Error("상품 재고가 부족합니다.");
      error.status = 400;
      throw error;
    }

    const totalUsedPoints = item.price * quantity;
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

    // 교환 내역 생성 및 재고 차감
    const exchange = await exchangeRepository.createExchangeAndReduceStock(userId, item, quantity, t);

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

module.exports = { getItems, exchangeItem, getMyExchanges, };