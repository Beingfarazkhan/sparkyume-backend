const User = require("../models/user");
const generateToken = require("../utils/generateToken");
const { jwtVerify } = require("jose");

const { JWT_SECRET } = require("../utils/jwtSecret");

const handleRegisterUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      res.status(400);
      throw new Error("All fields are required!");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400);
      throw new Error("User already exists!");
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    // Generating Token
    const payload = { userId: user._id.toString() };

    const accessToken = await generateToken(payload, "1m");
    const refreshToken = await generateToken(payload, "30d");

    // HTTP Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const handleLoginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      res.status(400);
      throw new Error("All fields are required!");
    }

    // find user by email
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401);
      throw new Error("Invalid Credentials!");
    }

    // Match password
    const isMatched = await user.matchPassword(password);

    if (!isMatched) {
      res.status(401);
      throw new Error("Invalid Credentials!");
    }

    const payload = { userId: user._id.toString() };

    // Generate token
    const accessToken = await generateToken(payload, "1m");
    const refreshToken = await generateToken(payload, "30d");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const handleLogoutUser = async (req, res, next) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({ message: "Logged out successfully!" });
};

const handleTokenRefresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      res.status(401);
      throw new Error("No Refresh Token!");
    }

    const { payload } = await jwtVerify(refreshToken, JWT_SECRET);

    const user = await User.findById(payload.userId);

    if (!user) {
      res.status(401);
      throw new Error("No User");
    }

    const newAccessToken = await generateToken(
      { userId: user._id.toString() },
      "1m"
    );

    res.status(200).json({
      newAccessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  handleRegisterUser,
  handleLoginUser,
  handleLogoutUser,
  handleTokenRefresh,
};
