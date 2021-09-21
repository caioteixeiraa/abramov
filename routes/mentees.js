const express = require("express");
const router = express.Router();

const cleanBody = require("../middlewares/cleanbody");
const AuthController = require("../src/mentees/mentee.controller");

router.post("/createMentee", cleanBody, AuthController.CreateMentee);
router.get("/getAllMentees", cleanBody, AuthController.GetAllMentees);

module.exports = router;
