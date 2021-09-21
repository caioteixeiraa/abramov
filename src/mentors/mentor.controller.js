const { options } = require("joi");
const Joi = require("joi");
const { Mongoose } = require("mongoose");
require("dotenv").config();
const { v4: uuid } = require("uuid");
const { db } = require("../mentors/mentor.model");

const Mentor = require("./mentor.model");

const mentorSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().required().email({ minDomainSegments: 2 }),
  state: Joi.string().required(),
  age: Joi.string().required(),
  linkedin: Joi.string().required(),
  github: Joi.string().required(),
  skills: Joi.array().required(),
  interests: Joi.array().required(),
  marketTime: Joi.string().required(),
  company: Joi.string()
});

exports.CreateMentor = async (req, res) => {
  try {
    const result = mentorSchema.validate(req.body)

    if (result.error) {
      return res.status(400).json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    result.value.userId = uuid()
    result.value.active = true

    const newMentor = new Mentor(result.value);
    await newMentor.save()

    return res.status(200).send({
      error: false,
      message: "Mentor created"
    })

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Cannot create mentor",
    });
  }
}

exports.GetAllMentors = async (req, res) => {
  try {
    const collection = db.collection('mentors')
    collection.find({}).toArray((err, result) => {
      if (err) {
        res.status(500).send(err)
      }
      return res.status(200).send(result)
    })
  } catch {
    return res.send(500).json({
      error: true,
      message: "Couldn't get mentors"
    })
  }
}