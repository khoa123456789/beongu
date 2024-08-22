const userController = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken")


const router = require("express").Router();


router.get("/get-one", verifyToken, userController.getOneUser);
router.get("/getAllUser", userController.getAllUser);
router.get("/getIdUser/:id", userController.getIdUser);
router.patch("/updateUser/:id", userController.updateUser);
router.delete("/deleteUser/:id", userController.deleteUser);

module.exports = router;


