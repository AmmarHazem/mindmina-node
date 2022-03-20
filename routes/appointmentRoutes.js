const express = require("express");
const authenticationMiddleware = require("../middleware/authenticationMiddleware");
const hasPermissionMiddleware = require("../middleware/hasPermissionMiddleware");
const {
  bookAppointment,
  getCurrentCustomerAppointments,
  getCurrentPractitionerAppointments,
  startAppointmentByPractitioner,
  joinAppointmentByCustomer,
  endAppointmentByPractitioner,
  endAppointmentByCustomer,
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
  "/end-appointment-by-customer",
  [authenticationMiddleware, hasPermissionMiddleware("customer", "admin")],
  endAppointmentByCustomer
);
router.post(
  "/join-appointment-by-customer",
  [authenticationMiddleware, hasPermissionMiddleware("customer", "admin")],
  joinAppointmentByCustomer
);
router.post(
  "/end-appointment-by-practitioner",
  [authenticationMiddleware, hasPermissionMiddleware("practitioner", "admin")],
  endAppointmentByPractitioner
);
router.post(
  "/start-appointment-by-practitioner",
  [authenticationMiddleware, hasPermissionMiddleware("practitioner", "admin")],
  startAppointmentByPractitioner
);
router.post("/book-appointment", [authenticationMiddleware], bookAppointment);

module.exports = router;
