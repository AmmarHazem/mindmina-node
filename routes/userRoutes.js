const express = require("express");
const {
  getAllPractitioners,
  deleteUser,
} = require("../controllers/userControllers");
const authenticationMiddleware = require("../middleware/authenticationMiddleware");
const hasPermissionMiddleware = require("../middleware/hasPermissionMiddleware");

const router = express.Router();

router.get("/practitioners", getAllPractitioners);
router.delete(
  "/:id",
  [authenticationMiddleware, hasPermissionMiddleware("admin")],
  deleteUser
);

module.exports = router;
