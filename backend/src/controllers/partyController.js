const partyService = require('../services/partyService');

async function getMyList(req, res, next) {
    try {
        const data = await partyService.getMyParties(req.user);
        res.status(200).json({ success: true, data, message: 'OK' });
    } catch (err) { return next(err); }
}

async function getDetail(req, res, next) {
    try {
        const data = await partyService.getPartyDetail(Number(req.params.id), req.user);
        res.status(200).json({ success: true, data, message: 'OK' });
    } catch (err) { return next(err); }
}

async function createComment(req, res, next) {
    try {
        const data = await partyService.addComment(Number(req.params.id), req.user, req.body);
        res.status(201).json({ success: true, data, message: '등록되었습니다.' });
    } catch (err) { return next(err); }
}

module.exports = { getMyList, getDetail, createComment };
