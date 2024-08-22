const createSuccess = require("../helpers/createSuccess");
const db = require("../models");
const createError = require("http-errors");
const donVangThiService = require("../services/donVangThiService");
const multer = require("multer");
const { use } = require("passport");

// Cấu hình Multer
const upload = multer({ dest: 'uploads/' });

const donVangThiController = {
  createDonVangThi: async (req, res, next) => {
    try {
      const { status, message, elements } =
        await donVangThiService.createDonVangThi(req.body);
      res.status(status).json(createSuccess(status, message, elements));
    } catch (error) {
      next(error);
    }
  },
  getAllDonVangThi: async (req, res, next) => {
    try {
      const { status, message, elements } =
        await donVangThiService.getAllDonVangThi();
      res.status(status).json(createSuccess(status, message, elements));
    } catch (error) {
      next(error);
    }
  },
  getAllByQueryDonVangThi: async (req, res, next) => {
    try {
      const query = req.body;
      const { status, message, elements } =
        await donVangThiService.getAllByQueryDonVangThi(query);
      res.status(status).json(createSuccess(status, message, elements));
    } catch (error) {
      next(error);
    }
  },
  getIdDonVangThi: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, message, elements } =
        await donVangThiService.getIdDonVangThi(id);
      res.status(status).json(createSuccess(status, message, elements));
    } catch (error) {
      next(error);
    }
  },
  getDonVangThiByUserId: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { status, message, elements } =
        await donVangThiService.getDonVangThiByUserId(userId);
      res.status(status).json(createSuccess(status, message, elements));
    } catch (error) {
      next(error);
    }
  },
  updateDonVangThi: async (req, res, next) => {
    try {
      console.log('Received Data:', req.body); // Kiểm tra dữ liệu nhận được từ client
      const userId = req.body.USER_ID
        // Đảm bảo rằng đang trích xuất đúng USER_ID
      if (!userId) throw createError.Conflict("USER_ID not provided");
      const isCheck = await db.Don_Vang_Thi.findOne({
        where: {
          USER_ID: userId
        },
      });
      if (!isCheck) throw createError.Conflict("id not exists");

      const { status, message } = await donVangThiService.updateDonVangThi(
        req.body,
        userId
      );
      res.status(status).json(createSuccess(status, message));
    } catch (error) {
      next(error);
    }
  },
  deleteDonVangThi: async (req, res, next) => {
    try {
      const { id } = req.params;
      const isCheck = await db.Don_Vang_Thi.findOne({
        where: {
          id: id,
        },
      });
      if (!isCheck) throw createError.Conflict("ID không tồn tại");
      const { status, message } = await donVangThiService.deleteDonVangThi(id);
      res.status(status).json(createSuccess(status, message));
    } catch (error) {
      next(error);
    }
  },
  uploadMinhChung: async (req, res, next) => {
    try {
      console.log(req.body)
      const id = req.body.USER_ID; // Lấy ID của đơn vắng thi từ request body
      if (!id) {
        return res.status(404).json("Id not found"); // Kiểm tra xem ID có tồn tại hay không
      }

      console.log(req.file); // Log file upload để kiểm tra

      // Gọi hàm uploadMinhChung trong service để thực hiện việc upload minh chứng
      const { status, message } = await donVangThiService.uploadMinhChung(
        id,
        req.file
      );

      // Trả về kết quả thành công
      return res.status(status).json({
        status,
        message,
      });
    } catch (error) {
      next(error); // Xử lý lỗi bằng middleware
    }
  },

};

module.exports = donVangThiController;
