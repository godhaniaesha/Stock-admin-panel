const express = require("express");
const { userController } = require("../../../controller")

const router = express.Router();

<<<<<<< HEAD
router.get("/",
=======
router.get("/getallUsers",
>>>>>>> 818acf246a083e8358a82becc48e3fe98e883725
    userController.getAllUsers
)

router.get("/:id",
    userController.getUserById
)

<<<<<<< HEAD
router.post("/",
=======
router.post("/createUser",
>>>>>>> 818acf246a083e8358a82becc48e3fe98e883725
    userController.createUser
)

router.put("/:id",
    userController.updateUser
)

router.delete("/:id",
    userController.deleteUser
)


module.exports = router