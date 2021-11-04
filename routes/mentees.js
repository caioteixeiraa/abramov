const express = require("express");
const router = express.Router();

const cleanBody = require("../middlewares/cleanbody");
const AuthController = require("../src/mentees/mentee.controller");

router.post("/create", cleanBody, AuthController.Create);
router.get("/getAllMentees", cleanBody, AuthController.GetAllMentees);
router.get("/getMenteeById", cleanBody, AuthController.GetMenteeById);
router.put("/update", cleanBody, AuthController.Update)
router.delete("/delete", cleanBody, AuthController.Delete)

module.exports = router;
