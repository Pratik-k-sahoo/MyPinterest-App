const JWT = require("jsonwebtoken");

const SECRET = "Pr@t!kM@nl23";

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    username: user.username,
    name: user.name,
    profileImage: user.profileImage,
  };
  const token = JWT.sign(payload, SECRET);

  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, SECRET);
  return payload;
}

module.exports = {
  createTokenForUser,
  validateToken,
};
