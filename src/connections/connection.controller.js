const { options } = require("joi");
const Joi = require("joi");
require("dotenv").config();
const { v4: uuid } = require("uuid");

const { sendEmail } = require("./helpers/mailerConnection");
const { getTokenData } = require("../helpers/authenticator");
const { db } = require("../mentors/mentor.model");
const Connection = require("./connection.model");
const { roles } = require('../roles/roles')

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
  
  try {
    const users = db.collection('users')
    users.find({ "userId": req.query.userId }).toArray(async (err, result) => {
      if (err) {
        return res.status(500).json(err)
      }
      
      const permission = roles.can(result[0].role).createAny('connection')
      if (!permission.granted) {
        return res.status(403).json({
          error: true,
          message: "Permission not granted",
        });
      } else {

        const result = connectionSchema.validate(req.body);
        if (result.error) {
          console.log(result.error.message);
          return res.status(400).json({
            error: true,
            status: 400,
            message: result.error.message,
          });
        }
    
        const mentee = await db.collection('mentees').findOne({ email: req.body.emailMentee })
        const mentor = await db.collection('mentors').findOne({ email: req.body.emailMentor })
        
        if (mentor.numberOfConnections === 0) {
          return res.status(400).json({
            error: true,
            message: "Number of mentor connections exceeded.",
          });
        }
        
        const sendEmailConnection = await sendEmail(mentee, mentor);
    
        if (sendEmailConnection.error) {
          return res.status(500).json({
            error: true,
            message: "Couldn't send email.",
          });
        }
    
        const id = uuid();
        result.value.connectionId = id;
        const remainingNumberOfConnections = mentor.numberOfConnections - 1

        await db.collection('mentors').updateOne({ "email": req.body.emailMentor }, {
          $set: {
            "numberOfConnections": remainingNumberOfConnections
          }
        })
        .then(() => {
          console.log("Updated mentor number of connections")
        })
        .catch(() => {
          console.error("Did not update mentor number of connections")
        })
    
        const newConnection = new Connection(result.value);
        await newConnection.save((err) => {
          if (err) {
            return res.status(500).json({ err: err.message })
          }
          else {
            return res.status(200).json({
              success: true,
              message: "Connection succeed!",
            });
          }
        });
      }
    })

  } catch (error) {
    console.error("connection-error", error);
    return res.status(500).json({
      error: true,
      message: "Cannot connect",
    });
  }
};