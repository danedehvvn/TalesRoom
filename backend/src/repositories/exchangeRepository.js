const { Item, PointExchange } = require('../models');

// 전체 상품 목록 조회
async function findAllItems() {
    return await Item.findAll({
        attributes: ['id', 'name', 'description', 'price', 'stock'],
        order: [['createdAt', 'DESC']],
    });
}

// 특정 상품 조회
async function findItemById(itemId) {
    return await Item.findByPk(itemId);
}

// 교환 내역 생성 및 상품 재고 차감 (트랜잭션 내부 처리용)
async function createExchangeAndReduceStock(userId, item, quantity, transaction) {
    const totalPoints = item.price * quantity;

    // 1. 교환 내역 기록 생성
    const exchange = await PointExchange.create({
        userId,
        itemId: item.id,
        quantity,
        usedPoints: totalPoints,
    }, { transaction });

    // 2. 상품 재고 차감
    item.stock -= quantity;
    await item.save({ transaction });

    return exchange;
}

// 유저의 교환 내역 조회 (마이페이지용)
async function findExchangesByUserId(userId) {
    return await PointExchange.findAll({
        where: { userId },
        include: [{ model: Item, attributes: ['name'] }],
        order: [['createdAt', 'DESC']],
    });
}

module.exports = { findAllItems, findItemById, createExchangeAndReduceStock, findExchangesByUserId, };