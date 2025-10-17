const dotenv = require("dotenv");
dotenv.config();

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

module.exports = { JWT_SECRET };
