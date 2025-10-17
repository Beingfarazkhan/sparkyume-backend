const express = require("express");
const {
  handleRegisterUser,
  handleLogoutUser,
  handleLoginUser,
  handleTokenRefresh,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", handleRegisterUser);

router.post("/logout", handleLogoutUser);

router.post("/login", handleLoginUser);

router.post("/refresh", handleTokenRefresh);

module.exports = router;
