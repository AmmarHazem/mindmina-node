const express = require("express");
const {
  createSpeciality,
  getSpecialities,
} = require("../controllers/practitionerSpecialityControllers");
const authenticationMiddleware = require("../middleware/authenticationMiddleware");
const hasPermissionMiddleware = require("../middleware/hasPermissionMiddleware");

const router = express.Router();

router.get("/", getSpecialities);
router.post(
  "/",
  [authenticationMiddleware, hasPermissionMiddleware("admin")],
  createSpeciality
);

module.exports = router;
