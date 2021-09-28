const { options } = require("joi");
const Joi = require("joi");
require("dotenv").config();
const { v4: uuid } = require("uuid");
const Mentee = require("./mentee.model");
const { db } = require("../mentees/mentee.model");
const { getTokenData } = require("../helpers/authenticator");

const menteeSchema = Joi.object().keys({
  name: Joi.string().required(),
  userId: Joi.string().required(),
  email: Joi.string().required().email({ minDomainSegments: 2 }),
  state: Joi.string().required(),
  age: Joi.string().required(),
  linkedin: Joi.string().required(),
  github: Joi.string().required(),
  skills: Joi.array().required(),
  interests: Joi.array().required(),
});

exports.Create = async (req, res) => {
  const token = req.headers.authorization
  const tokenData = getTokenData(token)

  if (!token || !tokenData) {
    return res.status(401).json({
      error: true,
      message: 'Not authenticated',
    });
  }

  try {
    const result = menteeSchema.validate(req.body)

    if (result.error) {
      console.log(result.error.message);
      return res.status(400).json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    result.value.userId = req.body.userId
    result.value.active = true

    const newMentee = new Mentee(result.value);
    await newMentee.save()

    return res.status(200).json({
      error: false,
      message: "Mentee created"
    })

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Cannot create mentee",
    });
  }
}

exports.GetAllMentees = async (req, res) => {
  const token = req.headers.authorization
  const tokenData = getTokenData(token)

  if (!token || !tokenData) {
    return res.status(401).json({
      error: true,
      message: 'Not authenticated',
    });
  }

  try {
    const collection = db.collection('mentees')
    collection.find({}).toArray((err, result) => {
      if (err) {
        console.log(err)
        res.status(500).send(err)
      }
      return res.status(200).send(result)
    })
  } catch {
    return res.send(500).json({
      error: true,
      message: "Couldn't get mentees"
    })
  }
}

exports.GetMenteeById = async (req, res) => {
  const token = req.headers.authorization
  const tokenData = getTokenData(token)

  if (!token || !tokenData) {
    return res.status(401).json({
      error: true,
      message: 'Not authenticated',
    });
  }

  try {
    const collection = db.collection('mentees')
    collection.find({"userId": req.query.userId}).toArray((err, result) => {
      if (err) {
        res.status(500).send(err)
      }
      if (result.length === 1) {
        delete result[0]._id
        delete result[0].userId
        delete result[0].updatedAt
        delete result[0].createdAt
        delete result[0].__v
        delete result[0].active
        return res.status(200).send(result)
      }
    })
  } catch {
    return res.send(500).json({
      error: true,
      message: "Couldn't get mentees"
    })
  }
}