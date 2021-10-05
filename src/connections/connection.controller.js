const { options } = require("joi");
const Joi = require("joi");
require("dotenv").config();
const { v4: uuid } = require("uuid");

const { sendEmail } = require("./helpers/mailerConnection");
const { getTokenData } = require("../helpers/authenticator");
const { db } = require("../mentors/mentor.model");
const Connection = require("./connection.model");

const connectionSchema = Joi.object().keys({
  emailMentee: Joi.string().email({ minDomainSegments: 2 }),
  emailMentor: Joi.string().email({ minDomainSegments: 2 }),
});

exports.Connect = async (req, res) => {
  const token = req.headers.authorization
  const tokenData = getTokenData(token)

  if (!token || !tokenData) {
    return res.status(401).send({
      error: true,
      message: 'Not authenticated',
    });
  }

  const users = db.collection('users')

  const user = await users.findOne({
    userId: req.query.userId,
  });

  if (user.role !== "admin") {
    return res.status(409).json({
      error: true,
      message: "Not allowed",
    });
  }

  try {
    const result = connectionSchema.validate(req.body);
    if (result.error) {
      console.log(result.error.message);
      return res.status(400).json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    const sendCode = await sendEmail(result.value.emailMentee, result.value.emailMentor);

    if (sendCode.error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't send email.",
      });
    }

    const id = uuid();
    result.value.connectionId = id;

    const newConnection = new Connection(result.value);
    await newConnection.save();

    return res.status(200).json({
      success: true,
      message: "Connection succeed!",
    });
  } catch (error) {
    console.error("connection-error", error);
    return res.status(500).json({
      error: true,
      message: "Cannot connect",
    });
  }
};