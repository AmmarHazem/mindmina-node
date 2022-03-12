const express = require("express");
const {
  createDaySlotsForPractitioner,
} = require("../controllers/appointmentTimeSlotControllers");
const hasPermissionMiddleware = require("../middleware/hasPermissionMiddleware");
const authenticationMiddleware = require("../middleware/authenticationMiddleware");

const router = express.Router();

router.post(
  "/create-day-slots",
  [authenticationMiddleware, hasPermissionMiddleware("admin", "clinic")],
  createDaySlotsForPractitioner
);

module.exports = router;
