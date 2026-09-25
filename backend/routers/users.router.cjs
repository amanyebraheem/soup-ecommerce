


const express = require("express");
const userController = require("../controllers/users.controller.cjs");

const router = express.Router();

router.post("/login", userController.login);

router.post("/register", userController.register);



module.exports = router;
