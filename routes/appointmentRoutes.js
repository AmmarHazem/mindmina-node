const express = require("express");
const authenticationMiddleware = require("../middleware/authenticationMiddleware");
const hasPermissionMiddleware = require("../middleware/hasPermissionMiddleware");
const {
  bookAppointment,
  getCurrentCustomerAppointments,
} = require("../controllers/appointmentControllers");

const router = express.Router();

router.get(
  "/current-customer-appointments",
  [authenticationMiddleware, hasPermissionMiddleware("customer", "admin")],
  getCurrentCustomerAppointments
);
router.post("/book-appointment", [authenticationMiddleware], bookAppointment);

module.exports = router;
