const express = require("express");
const {
  register,
  verifyEmail,
  login,
  refreshToken,
  logout,
} = require("../controllers/authControllers");
const authenticationMiddleware = require("../middleware/authenticationMiddleware");

const router = express.Router();

router.post("/logout", [authenticationMiddleware], logout);
router.post("/refresh-token", refreshToken);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/register", register);

module.exports = router;
