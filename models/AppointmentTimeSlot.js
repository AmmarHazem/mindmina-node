const mongoose = require("mongoose");

const AppointmentTimeSlotSchema = new mongoose.Schema(
  {
    startDateTime: {
      type: Date,
      required: true,
    },
    endDateTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      default: 60 * 15,
    },
    practitioner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

AppointmentTimeSlotSchema.index({ startDateTime: 1 });

AppointmentTimeSlotSchema.virtual("appointment", {
  ref: "Appointment",
  localField: "_id",
  foreignField: "slot",
  justOne: true,
});

// AppointmentTimeSlotSchema.virtual("duration").get(function () {
//   const duration = this.startDateTime - this.endDateTime;
//   return duration.asSeconds();
// });

// AppointmentTimeSlotSchema.virtual("endDateTime").get(function () {
//   return moment(this.startDateTime).add(this.duration, "seconds").toDate();
// });

AppointmentTimeSlotSchema.index(
  { practitioner: 1, startDateTime: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "AppointmentTimeSlot",
  AppointmentTimeSlotSchema
);
