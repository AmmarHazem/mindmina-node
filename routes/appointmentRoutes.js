const express = require("express");
const authenticationMiddleware = require("../middleware/authenticationMiddleware");
const hasPermissionMiddleware = require("../middleware/hasPermissionMiddleware");
const {
  bookAppointment,
  getCurrentCustomerAppointments,
  getCurrentPractitionerAppointments,
  startAppointmentByPractitioner,
} = require("../controllers/appointmentControllers");

const router = express.Router();

router.get(
  "/current-practitioner-appointments",
  [authenticationMiddleware, hasPermissionMiddleware("practitioner", "admin")],
  getCurrentPractitionerAppointments
);
router.get(
  "/current-customer-appointments",
  [authenticationMiddleware, hasPermissionMiddleware("customer", "admin")],
  getCurrentCustomerAppointments
);
router.post(
  "/start-appointment-by-practitioner",
  [authenticationMiddleware, hasPermissionMiddleware("practitioner", "admin")],
  startAppointmentByPractitioner
);
router.post("/book-appointment", [authenticationMiddleware], bookAppointment);

module.exports = router;
