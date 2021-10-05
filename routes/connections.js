const express = require("express");
const router = express.Router();

const cleanBody = require("../middlewares/cleanbody");
const AuthController = require("../src/connections/connection.controller");

router.post("/connect", cleanBody, AuthController.Connect);

module.exports = router;
