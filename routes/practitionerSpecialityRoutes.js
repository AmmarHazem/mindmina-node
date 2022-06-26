const express = require("express");
const {
  createSpeciality,
  getSpecialities,
  addSpecialityToPractitioner,
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
router.put(
  "/add-speciality-to-practitioner",
  [authenticationMiddleware, hasPermissionMiddleware("admin")],
  addSpecialityToPractitioner
);

module.exports = router;
