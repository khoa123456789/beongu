const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization; // Sử dụng authorization thay vì authentication
    const token = authHeader && authHeader.split(' ')[1]; // Lấy token sau "Bearer"

    if (!token) {
        return res.status(200).json({
            err: 1,
            msg: 'No login',
        });
    }

    jwt.verify(token, 'tringu', (err, decode) => {
        if (err) {
            return res.status(200).json({
                err: 2,
                msg: 'Token failed',
            });
        }

        req.currentUser = decode; // Đặt thông tin người dùng vào req
        next(); // Chuyển đến middleware hoặc route handler tiếp theo
    });
};

module.exports = verifyToken;
