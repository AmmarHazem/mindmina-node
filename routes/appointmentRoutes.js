const express = require("express");
const authenticationMiddleware = require("../middleware/authenticationMiddleware");
const { bookAppointment } = require("../controllers/appointmentControllers");

const router = express.Router();

router.post("/book-appointment", [authenticationMiddleware], bookAppointment);

module.exports = router;
