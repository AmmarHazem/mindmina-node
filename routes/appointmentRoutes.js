const express = require("express");
const authenticationMiddleware = require("../middleware/authenticationMiddleware");
const {
  bookAppointment,
  getCurrentCustomerAppointments,
} = require("../controllers/appointmentControllers");

const router = express.Router();

router.get(
  "/current-customer-appointments",
  [authenticationMiddleware],
  getCurrentCustomerAppointments
);
router.post("/book-appointment", [authenticationMiddleware], bookAppointment);

module.exports = router;
