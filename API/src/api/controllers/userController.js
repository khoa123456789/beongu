const createSuccess = require("../helpers/createSuccess");
const db = require("../models");
const createError = require("http-errors");
const userService = require("../services/userService");

const userController = {
  getOneUser: async (req, res) => {
    try {
      const { currentUser } = req;  // Lấy id từ query params


      if (!currentUser?.id) {
        return res.status(400).json({
          err: 1,
          msg: 'missing inputs'
        });
      }

      let response = await userService.getOne(currentUser?.id); // Gọi service để lấy thông tin người dùng
      res.status(200).json(response);
    } catch (error) {
      console.error("Error in getOneUser:", error);
      res.status(500).json({
        err: -1,
        msg: `fail at userController: ${error.message || error}`
      });
    }
  },

  getAllUser: async (req, res, next) => {
    try {
      const { status, message, elements } = await userService.getAlluser();
      res.status(status).json(createSuccess(status, message, elements));
    } catch (error) {
      next(error);
    }
  },

  getIdUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, message, elements } = await userService.getIdUser(id);
      res.status(status).json(createSuccess(status, message, elements));
    } catch (error) {
      next(error);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const { id } = req.params;

      const isCheck = await db.Users.findOne({
        where: {
          id: id,
          IS_DELETED: false,
        },
      });
      if (!isCheck) throw createError.Conflict("id not exists");
      const { status, message } = await userService.updateUser(req.body, id);
      res.status(status).json(createSuccess(status, message));
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const isCheck = await db.Users.findOne({
        where: {
          id: id,
        },
      });
      if (!isCheck) throw createError.Conflict("id not exists");
      const { status, message } = await userService.deleteUser(id);
      res.status(status).json(createSuccess(status, message));
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
