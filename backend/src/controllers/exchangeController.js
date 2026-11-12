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

// [관리자] 상품 등록 컨트롤러 (Create)
const createItem = async (req, res) => {
    try {
        const userId = await req.user.id; // 로그인한 관리자 ID 추출 
        const data = await exchangeService.createItem(req.body, userId);
        return res.status(201).json({ success: true, data, message: "상품이 성공적으로 등록되었습니다." });
    } catch (error) {
        return sendErrorResponse(res, error);
    }
};

// [관리자] 상품 수정 컨트롤러 (Update)
const updateItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const data = await exchangeService.updateItem(itemId, req.body);
        return res.status(200).json({ success: true, data, message: "상품이 성공적으로 수정되었습니다." });
    } catch (error) {
        return sendErrorResponse(res, error);
    }
};

// [관리자] 상품 삭제 컨트롤러 (Delete)
const deleteItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        await exchangeService.deleteItem(itemId);
        return res.status(200).json({ success: true, data: null, message: "상품이 성공적으로 삭제되었습니다." });
    } catch (error) {
        return sendErrorResponse(res, error);
    }
};

// [관리자] 전체 교환 내역 조회 컨트롤러
async function getAllExchanges(req, res, next) {
    try {
        if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'admin')) {
            return res.status(403).json({ success: false, message: '접근 권한이 없습니다.' });
        }
        
        const history = await exchangeService.getAllExchanges();
        res.status(200).json({ success: true, data: history });
    } catch (err) {
        next(err);
    }
};

module.exports = { getItems, exchangeItem, getMyExchanges, createItem, updateItem, deleteItem, getAllExchanges };