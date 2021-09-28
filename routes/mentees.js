const express = require("express");
const router = express.Router();

const cleanBody = require("../middlewares/cleanbody");
const AuthController = require("../src/mentees/mentee.controller");

router.post("/create", cleanBody, AuthController.Create);
router.get("/getAllMentees", cleanBody, AuthController.GetAllMentees);
router.get("/getMenteeById", cleanBody, AuthController.GetMenteeById);

module.exports = router;
