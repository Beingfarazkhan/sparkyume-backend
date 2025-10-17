const { SignJWT } = require("jose");

const { JWT_SECRET } = require("./jwtSecret");

const generateToken = async (payload, expiresIn = "15m") => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
};

module.exports = generateToken;
