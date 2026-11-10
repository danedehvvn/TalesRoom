const recruitmentService = require('../services/recruitmentService');

// POST
async function create(req, res) {
    try {
        const data = await recruitmentService.createRecruitment(req.user, req.body);
        res.status(201).json({ success: true, data, message: '모집글이 등록되었습니다.'});
    } catch (err) {
        const status = err.status || 500;
        if (status === 500) console.error(err);
        res.status(status).json({ success: false, data: null, message: err.message });
    }
}

// GET
async function getList(req,res) {
    try {
        const data = await recruitmentService.getRecruitments(req.query);
        res.status(200).json({ success: true, data, message: 'OK' });
    } catch (err) {
        const status = err.status || 500;
        if (status === 500) console.error(err);
        res.status(status).json({ success: false, data: null, message: err.message });
    }
}

async function getDetail(req, res) {
    try {
        const id = Number(req.params.id);
        const data = await recruitmentService.getRecruitmentDetail(id, req.user);
        res.status(200).json({ success: true, data, message: 'OK' });
    } catch (err) {
        const status = err.status || 500;
        if (status === 500) console.error(err);
        res.status(status).json({ success: false, data: null, message: err.message });
    }
}

// POST :id/aplications
async function apply(req, res) {
    try {
        const id = Number(req.params.id);                                           
        const data = await recruitmentService.applyRecruitment(id, req.user, req.body);
        res.status(201).json({ success: true, data, message: '신청되었습니다.' });
    } catch (err) {
        const status = err.status || 500;
        if (status === 500) console.error(err);
        res.status(status).json({ success: false, data: null, message: err.message });
    }
}

module.exports = { create, getList, getDetail, apply };