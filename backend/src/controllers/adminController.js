const adminService = require('../services/adminService');

async function getUsers(req, res) {
    try {
        const data = await adminService.getUsers(req.query);
        res.status(200).json({ success: true, data, message: 'OK'});
    } catch (err) {
        const status = err.status || 500;
        if (status === 500) console.error(err);         // 예상못한 에러만 console
        res.status(status).json({ success: false, data: null, message: err.message });
    }
}

module.exports = { getUsers };