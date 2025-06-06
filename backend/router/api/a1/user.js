const express = require("express");
const { userController } = require("../../../controller");
const upload = require("../../../middleware/upload");

const router = express.Router();

router.get("/getallUsers",
    userController.getAllUsers
)

router.get("/:id",
    userController.getUserById
)

router.post("/createUser", upload.single("profileImage"), userController.createUser);

router.put("/:id",
    userController.updateUser
)

router.delete("/:id",
    userController.deleteUser
)


module.exports = router