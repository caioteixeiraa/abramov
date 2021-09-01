const jwt = require("jsonwebtoken");
require("dotenv").config();

async function generateJwt(email, userId) {
  try {
    const payload = { email: email, id: userId };
    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });
    return { error: false, token: token };
  } catch (error) {
    return { error: true };
  }
}

module.exports = { generateJwt };