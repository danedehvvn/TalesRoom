const exchangeService = require('../services/exchangeService');

const sendErrorResponse = (res, error) => {
    const statusCode = error.status || error.statusCode || 500;
    console.error(error);
    const message = statusCode === 500 ? "서버 내부 오류가 발생했습니다." : error.message;
    return res.status(statusCode).json({ success: false, data: null, message });
};

// 교환소 상품 목록 조회
const getItems = async (req, res) => {
    try {
        const data = await exchangeService.getItems();
        return res.status(200).json({ success: true, data, message: "OK" });
    } catch (error) {
        return sendErrorResponse(res, error);
    }
};

// 상품 교환 신청
const exchangeItem = async (req, res) => {
    try {
        const userId = req.user.id; // 로그인한 유저 ID (인증 미들웨어 필수)
        const data = await exchangeService.exchangeItem(userId, req.body);
        return res.status(200).json({ success: true, data, message: "상품이 성공적으로 교환되었습니다." });
    } catch (error) {
        return sendErrorResponse(res, error);
    }
};

// 내 교환 내역 조회
const getMyExchanges = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = await exchangeService.getMyExchanges(userId);
        return res.status(200).json({ success: true, data, message: "OK" });
    } catch (error) {
        return sendErrorResponse(res, error);
    }
};

module.exports = { getItems, exchangeItem, getMyExchanges, };