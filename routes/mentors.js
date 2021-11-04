const express = require("express");
const router = express.Router();

const cleanBody = require("../middlewares/cleanbody");
const AuthController = require("../src/mentors/mentor.controller");

router.post("/create", cleanBody, AuthController.Create);
router.get("/getAllMentors", cleanBody, AuthController.GetAllMentors);
router.get("/getMentorById", cleanBody, AuthController.GetMentorById);
router.put("/update", cleanBody, AuthController.Update);
router.delete("/delete", cleanBody, AuthController.Delete);

module.exports = router;