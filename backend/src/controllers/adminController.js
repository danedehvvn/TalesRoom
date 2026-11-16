const adminService = require('../services/adminService');

async function getUsers(req, res, next) {
    try {
        const data = await adminService.getUsers(req.query);
        res.status(200).json({ success: true, data, message: 'OK'});
    } catch (err) {
        return next(err);
    }
}

module.exports = { getUsers };