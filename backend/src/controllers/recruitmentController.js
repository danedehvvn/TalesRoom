const recruitmentService = require('../services/recruitmentService');

// POST
async function create(req, res, next) {
    try {
        const data = await recruitmentService.createRecruitment(req.user, req.body);
        res.status(201).json({ success: true, data, message: '모집글이 등록되었습니다.'});
    } catch (err) {
        return next(err);
    }
}

// GET
async function getList(req, res, next) {
    try {
        const data = await recruitmentService.getRecruitments(req.query);
        res.status(200).json({ success: true, data, message: 'OK' });
    } catch (err) {
        return next(err);
    }
}

async function getDetail(req, res, next) {
    try {
        const id = Number(req.params.id);
        const data = await recruitmentService.getRecruitmentDetail(id, req.user);
        res.status(200).json({ success: true, data, message: 'OK' });
    } catch (err) {
        return next(err);
    }
}

// POST :id/aplications
async function apply(req, res, next) {
    try {
        const id = Number(req.params.id);                                           
        const data = await recruitmentService.applyRecruitment(id, req.user, req.body);
        res.status(201).json({ success: true, data, message: '신청되었습니다.' });
    } catch (err) {
        return next(err);
    }
}

async function decide(req, res, next) {
    try {
        const id = Number(req.params.id);
        const applicationId = Number(req.params.applicationId);
        const data = await recruitmentService.decideApplication(id, applicationId, req.user, req.body);
        const message = data.status === 'APPROVED' ? '승인되었습니다.' : '거절되었습니다.';
        res.status(200).json({ success: true, data, message });
    } catch (err) {
        return next(err);
    }
}

// PATCH 확정
async function close(req, res, next) {
    try {
        const data = await recruitmentService.closeRecruitment(Number(req.params.id), req.user);
        res.status(200).json({ success: true, data, message: '파티가 확정되었습니다.'});
    } catch (err) {
        return next(err);
    }
}

// PATCH 취소
async function cancel(req, res, next) {
    try {
        const data = await recruitmentService.cancelRecruitment(Number(req.params.id), req.user);
        res.status(200).json({ success: true, data, message: '취소되었습니다.'});
    } catch (err) {
        return next(err);
    }
}

module.exports = { create, getList, getDetail, apply, decide, close, cancel };