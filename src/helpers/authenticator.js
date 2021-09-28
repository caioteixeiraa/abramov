const jwt = require("jsonwebtoken")

function getTokenData(token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET)

  const result = {
    id: payload.id
  };

  return result;
}

module.exports = { getTokenData }