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

// 교환 내역 생성 및 상품 재고 차감 (quantity 제거, 1개 고정 차감)
async function createExchangeAndReduceStock(userId, item, transaction) {
    const totalPoints = item.price; // 1개 단가 기준

    // 1. 교환 내역 기록 생성 (quantity 필드 제거)
    const exchange = await PointExchange.create({
        userId,
        itemId: item.id,
        usedPoints: totalPoints,
    }, { transaction });

    // 2. 상품 재고 1개 차감
    item.stock -= 1;
    await item.save({ transaction });

    return exchange;
}

// 유저의 교환 내역 조회 (마이페이지용)
async function findExchangesByUserId(userId) {
    return await PointExchange.findAll({
        where: { userId },
        include: [{ model: Item, attributes: ['id', 'name'] }],
        order: [['createdAt', 'DESC']],
    });
}

// [관리자] 전체 교환 내역 조회 (500 에러 원인 해결용 추가)
async function findAllExchanges() {
    return await PointExchange.findAll({
        include: [{ model: Item, attributes: ['id', 'name'] }],
        order: [['createdAt', 'DESC']],
    });
}

// [관리자] 상품 등록 
async function createItem(itemData) {
    return await Item.create(itemData);
}

// [관리자] 상품 수정 
async function updateItem(itemId, itemData) {
    const item = await Item.findByPk(itemId);
    if (!item) return null;
    return await item.update(itemData);
}

// [관리자] 상품 삭제
async function deleteItem(itemId) {
    const item = await Item.findByPk(itemId);
    if (!item) return null;
    await item.destroy();
    return true;
}

module.exports = { findAllItems, findItemById, createExchangeAndReduceStock, findExchangesByUserId, findAllExchanges, createItem, updateItem, deleteItem };