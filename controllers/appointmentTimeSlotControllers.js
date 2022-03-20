const AppointmentTimeSlotModel = require("../models/AppointmentTimeSlot");
const UserModel = require("../models/User");
const moment = require("moment");
const CustomErrors = require("../errors");

const dayStartHour = "09";

const createDaySlotsForPractitioner = async (request, response) => {
  const dayDateString =
    request.body.date || moment().add(1, "days").format("YYYY-MM-DD");
  const practitionerID = request.body.practitionerID;
  const slotDurationInMinutes = request.body.slotDurationInMinutes || 15;
  const practitioner = await UserModel.findById(practitionerID);
  if (!practitioner) {
    throw new CustomErrors.NotFoundError("invalid practitioner ID");
  }
  const dayStartDateTime = moment(`${dayDateString} ${dayStartHour}`);
  const dayEndDateTime = dayStartDateTime.clone().add(8, "hours");
  let currentSlotTime = dayStartDateTime.clone();
  const slotDocs = [];
  while (currentSlotTime.isBefore(dayEndDateTime)) {
    slotDocs.push({
      startDateTime: currentSlotTime.toDate(),
      endDateTime: currentSlotTime
        .clone()
        .add(slotDurationInMinutes, "minutes"),
      practitioner: practitionerID,
      duration: slotDurationInMinutes * 60,
    });
    currentSlotTime = currentSlotTime.add(slotDurationInMinutes, "minutes");
  }
  const slots = await AppointmentTimeSlotModel.insertMany(slotDocs);
  response.json({
    count: slots.length,
    slots,
  });
};

module.exports = { createDaySlotsForPractitioner };
