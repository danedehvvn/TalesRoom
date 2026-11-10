const partyService = require('../services/partyService');

// 공통 에러
function sendError(res, err) {
    const status = err.status || 500;
    if (status === 500) console.error(err);
    res.status(status).json({ success: false, data: null, message: err.message });
}

// GET
async function getMyList(req, res) {
    try {
        const data = await partyService.getMyParties(req.user);
        res.status(200).json({ success: true, data, message: 'OK' });
    } catch (err) { sendError(res, err); }
}

async function getDetail(req, res) {
    try {
        const data = await partyService.getPartyDetail(Number(req.params.id), req.user);
        res.status(200).json({ success: true, data, message: 'OK' });
    } catch (err) { sendError(res, err); }
}

// POST
async function createComment(req, res) {
    try {
        const data = await partyService.addComment(Number(req.params.id), req.user, req.body);
        res.status(201).json({ success: true, data, message: '등록되었습니다.' });
    } catch (err) { sendError(res, err); }
}

module.exports = { getMyList, getDetail, createComment };