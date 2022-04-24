const express = require("express");
const {
  getAllPractitioners,
  deleteUser,
  getCurrentClinicPractitioners,
} = require("../controllers/userControllers");
const authenticationMiddleware = require("../middleware/authenticationMiddleware");
const hasPermissionMiddleware = require("../middleware/hasPermissionMiddleware");

const router = express.Router();

router.get(
  "/get-current-clinic-practitioners",
  [authenticationMiddleware, hasPermissionMiddleware("clinic")],
  getCurrentClinicPractitioners
);
router.get("/practitioners", getAllPractitioners);
router.delete(
  "/:id",
  [authenticationMiddleware, hasPermissionMiddleware("admin")],
  deleteUser
);

module.exports = router;
