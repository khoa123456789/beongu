const createSuccess = require("../helpers/createSuccess");
const db = require("../models");
const createError = require("http-errors");
const lichThiService = require("../services/lichThiService");
const { Op } = require('sequelize');

const lichThiController = {
  createLichThi: async (req, res, next) => {
    try {
      const { status, message, elements } = await lichThiService.createLichThi(
        req.body
      );
      res.status(status).json(createSuccess(status, message, elements));
    } catch (error) {
      next(error);
    }
  },
  getAllLichThi: async (req, res, next) => {
    try {
      const { status, message, elements } =
        await lichThiService.getAllLichThi();
      res.status(status).json(createSuccess(status, message, elements));
    } catch (error) {
      next(error);
    }
  },
  getAllByQueryLichThi: async (req, res, next) => {
    try {
      const query = req.body;
      const { status, message, elements } =
        await lichThiService.getAllByQueryLichThi(query);
      res.status(status).json(createSuccess(status, message, elements));
    } catch (error) {
      next(error);
    }
  },
  getIdLichThi: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, message, elements } = await lichThiService.getIdLichThi(
        id
      );
      res.status(status).json(createSuccess(status, message, elements));
    } catch (error) {
      next(error);
    }
  },
  getLichThiByUserId: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { status, message, elements } =
        await lichThiService.getLichThiByUserId(userId);
      res.status(status).json(createSuccess(status, message, elements));
    } catch (error) {
      next(error);
    }
  },
  updateLichThi: async (req, res, next) => {
    try {
      const { id } = req.params;
      const isCheck = await db.Lich_Thi.findOne({
        where: {
          id: id,
        },
      });
      if (!isCheck) throw createError.Conflict("id not exists");

      const { status, message } = await lichThiService.updateLichThi(
        req.body,
        id
      );
      res.status(status).json(createSuccess(status, message));
    } catch (error) {
      next(error);
    }
  },
  // Phương thức mới để cập nhật nhiều Lich_Thi cùng một lúc
  updateMultipleLichThi: async (req, res, next) => {
    try {
        const { ids, data } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            throw createError.BadRequest("Invalid input format: ids must be a non-empty array");
        }

        if (typeof data !== 'object' || Array.isArray(data)) {
            throw createError.BadRequest("Invalid input format: data must be an object");
        }

        // Kiểm tra sự tồn tại của tất cả các ID trong mảng
        const existingLichThi = await db.Lich_Thi.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
        });

        if (existingLichThi.length !== ids.length) {
            throw createError.Conflict("One or more IDs do not exist");
        }

        // Gọi service để cập nhật nhiều bản ghi với cùng một dữ liệu
        const { status, message } = await lichThiService.updateMultipleLichThi(ids, data);
        res.status(status).json(createSuccess(status, message));
    } catch (error) {
        next(error);
    }
},
  deleteLichThi: async (req, res, next) => {
    try {
      const { id } = req.params;
      const isCheck = await db.Lich_Thi.findOne({
        where: {
          id: id,
        },
      });
      if (!isCheck) throw createError.Conflict("id not exists");
      const { status, message } = await lichThiService.deleteLichThi(id);
      res.status(status).json(createSuccess(status, message));
    } catch (error) {
      next(error);
    }
  },
};

module.exports = lichThiController;
