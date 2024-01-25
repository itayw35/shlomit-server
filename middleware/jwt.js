const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;
function createToken(_id) {
  return jwt.sign({ _id }, secret);
}
function validateToken(token) {
  const accessToken = jwt.verify(token, secret);
  return accessToken;
}

module.exports = { createToken, validateToken };
