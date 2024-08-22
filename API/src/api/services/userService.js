const db = require("../models");
const { logCreate, logUpdate } = require("../helpers/logQuery");
const createError = require("http-errors");
const { Op, QueryTypes } = require("sequelize");

const userService = {
  getOne: async (id) =>{
    return new Promise(async (resolve, reject) => {
      try {
        let response = await db.Users.findOne({
          where: {id},
          raw: true
        })
        resolve({
          err: response ? 0 : 4,
          msg: response ? 'oke' : 'user not found!',
          response
        })
      } catch (error) {
        reject({
          err: 2,
          msg: 'fail at userservice!' + error
        })
        
        
      }
    })

  },
  createUser: async (user) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await db.Users.create({
          ...user,
        });
        await logCreate("Users", response); // Log creation if needed
        resolve({
          status: response ? 200 : 404,
          message: response
            ? "Create user successfully!"
            : "Error while creating user",
          elements: response,
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  updateUser: async (userId, userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await db.Users.update(userData, {
          where: {
            id: userId,
            IS_DELETED: false,
          },
        });
        if (response[0] === 0) {
          resolve({
            status: 404,
            message: "User not found or already deleted",
          });
        } else {
          await logUpdate("Users", { id: userId, ...userData }); // Log update if needed
          resolve({
            status: 200,
            message: "Update user successfully!",
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  deleteUser: async (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await db.Users.update(
          { IS_DELETED: true },
          {
            where: {
              id: userId,
            },
          }
        );
        if (response[0] === 0) {
          resolve({
            status: 404,
            message: "User not found or already deleted",
          });
        } else {
          resolve({
            status: 200,
            message: "Delete user successfully!",
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  getAllUser: async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await db.Users.findAll({
          where: {
            IS_DELETED: false,
          },
          include: [
            {
              model: db.Cities,
              required: false,
            },
          ],
        });
        resolve({
          status: response ? 200 : 404,
          message: response
            ? "Get list user successfully"
            : "Error while getting list user",
          elements: response,
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  getIdUser: async (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await db.Users.findOne({
          where: {
            id: userId,
            IS_DELETED: false,
          },
          include: [
            {
              model: db.Working_Statuses,
              where: {
                IS_DELETED: false,
              },
            },
            {
              model: db.Cities,
              where: {
                IS_DELETED: false,
              },
            },
            {
              model: db.Districts,
              where: {
                IS_DELETED: false,
              },
            },
            {
              model: db.Wards,
              where: {
                IS_DELETED: false,
              },
            },
          ],
        });
        resolve({
          status: response ? 200 : 404,
          message: response
            ? "Get user by ID successfully"
            : "Error while getting user by ID",
          elements: response,
        });
      } catch (error) {
        reject(error);
      }
    });
  },
};

module.exports = userService;
