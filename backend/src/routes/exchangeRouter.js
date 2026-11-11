const express = require("express");
const exchangeController = require("../controllers/exchangeController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// 상품 목록 조회 (로그인 여부와 관계없이 볼 수 있게 하려면 authMiddleware 분리 가능, 일단 인증 적용형태)
router.get("/", exchangeController.getItems);

// 인증이 필요한 라우터 그룹에 미들웨어 적용
router.use(authMiddleware);

router.post("/", exchangeController.exchangeItem);        // 상품 교환하기
router.get("/me", exchangeController.getMyExchanges);     // 내 교환 내역 조회

// [관리자용] 전체 유저 교환 내역 조회 경로 추가
router.get("/admin/history", authMiddleware, exchangeController.getAllExchanges);

// [관리자용] 상품 관리 라우터 추가 (경로 분리)
router.post("/items", authMiddleware, exchangeController.createItem);       // 상품 등록
router.put("/items/:itemId", authMiddleware, exchangeController.updateItem);    // 상품 수정
router.delete("/items/:itemId", authMiddleware, exchangeController.deleteItem); // 상품 삭제

module.exports = router;