const express = require("express");
const router = express.Router();

const cleanBody = require("../middlewares/cleanbody");
const AuthController = require("../src/mentors/mentor.controller");

router.post("/createMentor", cleanBody, AuthController.CreateMentor);
router.get("/getAllMentors", cleanBody, AuthController.GetAllMentors);

module.exports = router;