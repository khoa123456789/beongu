const authController = require("../controllers/authController");
const passport = require("passport");
const router = require("express").Router();
require("dotenv").config();

// Khởi tạo cấu hình Passport
authController.authController();

// Route để bắt đầu quá trình xác thực với Google
router.get('/google',
  passport.authenticate('google', {scope: ['profile', 'email'], session: false})
);

// Route để xử lý callback từ Google
router.get(
  "/google/redirect",
  passport.authenticate('google', { session: false }), // Xác thực người dùng từ Google
  (req, res) => {
    // Profile người dùng hiện có sẵn trong req.user
    const user = req.user;
    const userEmail = user.emails[0].value

    // Chuyển hướng người dùng đến URL sau khi đăng nhập thành công
    res.redirect(`${process.env.URL_CLIENT}/loginsuccess/${userEmail}`);
  }
);
router.post('/loginsuccess',authController.logginSuccess)

// Route để xử lý logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:3000/");
  });
});

module.exports = router;
