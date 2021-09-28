const { options } = require("joi");
const Joi = require("joi");
const { Mongoose } = require("mongoose");
require("dotenv").config();
const { v4: uuid } = require("uuid");
const { getTokenData } = require("../helpers/authenticator");
const { db } = require("../mentors/mentor.model");

const Mentor = require("./mentor.model");

const mentorSchema = Joi.object().keys({
  name: Joi.string().required(),
  userId: Joi.string().required(),
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
    const result = mentorSchema.validate(req.body)
    console.log(result)
    if (result.error) {
      return res.status(400).json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

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
    return res.status(500).send({
      error: true,
      message: "Couldn't get mentors"
    })
  }
}

exports.GetMentorById = async (req, res) => {
  const token = req.headers.authorization
  const tokenData = getTokenData(token)

  if (!token || !tokenData) {
    return res.status(401).json({
      error: true,
      message: 'Not authenticated',
    });
  }

  try {
    const collection = db.collection('mentors')
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
      } else {
        return res.status(400).send({error: true, message: "couldn't find mentor"})
      }
    })
  } catch {
    return res.status(500).send({
      error: true,
      message: "Couldn't get mentors"
    })
  }
}

exports.Update = async (req, res) => {
  const token = req.headers.authorization
  const tokenData = getTokenData(token)

  if (!token || !tokenData) {
    return res.status(401).send({
      error: true,
      message: 'Not authenticated',
    });
  }

  try {
    req.body.userId = req.query.userId
    const result = mentorSchema.validate(req.body)
    const collection = db.collection('mentors')
    collection.updateOne({ "userId": req.query.userId }, {
      $set: {
        "name": result.value.name,
        "email": result.value.email,
        "state": result.value.state,
        "age": result.value.age,
        "linkedin": result.value.linkedin,
        "github": result.value.github,
        "skills": result.value.skills,
        "interests": result.value.interests,
        "marketTime": result.value.marketTime,
        "company": result.value.company
      }
    }).then(() => {
      return res.status(200).send({
        error: false,
        message: "Updated successfully"
      })
    })
    .catch(() => {
      return res.status(500).send({
        error: true,
        message: "Couldn't update mentor"
      })
    })
  } catch {
    return res.status(500).send({
      error: true,
      message: "Couldn't update mentor"
    })
  }
}