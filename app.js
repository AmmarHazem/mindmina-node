require("dotenv").config();
require("express-async-errors");
const express = require("express");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const routeNotFoundMiddleware = require("./middleware/routeNotFoundMiddleware");
const errorHandlerMiddleware = require("./middleware/errorHandlerMiddleware");
const appointmentTimeSlotRoutes = require("./routes/appointmentTimeSlotRoutes");
const uploadFileRoutes = require("./routes/uploadFileRoutes");
const userRoutes = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const practitionerSpecialityRoutes = require("./routes/practitionerSpecialityRoutes");

// const AppointmentModel = require("./models/Appointment");
// const AppointmentTimeSlotModel = require("./models/AppointmentTimeSlot");
const UserModel = require("./models/User");

const app = express();
app.use(express.static("./public"));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/time-slots", appointmentTimeSlotRoutes);
app.use("/api/v1/files", uploadFileRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/practitioner-speciality", practitionerSpecialityRoutes);
app.use("/testing-here", async (request, response) => {
  const user = await UserModel.findById("622c62fb7175d1cd08acd044").populate(
    "practitioners"
  );
  response.json({ user });
});
app.use(routeNotFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8000;

const start = async () => {
  try {
    console.log("Connecting to DB");
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (e) {
    console.log("=== start server error");
    console.log(e);
  }
};

start();
