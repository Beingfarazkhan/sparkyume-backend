const { jwtVerify } = require("jose");
const { JWT_SECRET } = require("../utils/jwtSecret.js");
const User = require("../models/user.js");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("No Authorization Token Found");
    }

    const token = authHeader.split(" ")[1];

    const { payload } = await jwtVerify(token, JWT_SECRET);

    const user = await User.findById(payload.userId).select("_id name email");

    if (!user) {
      res.status(401);
      throw new Error("User Not Found!");
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401);
    next(new Error("Not Authenticated!"));
  }
};

module.exports = protect;
