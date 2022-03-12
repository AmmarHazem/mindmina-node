const AppointmentTimeSlotModel = require("../models/AppointmentTimeSlot");
const moment = require("moment");
const CustomErrors = require("../errors");

const dayStartHour = "09";

const createDaySlotsForPractitioner = async (request, response) => {
  const dayDateString =
    request.body.date || moment().add(1, "days").format("YYYY-MM-DD");
  const practitionerID = request.body.practitionerID;
  if (!practitionerID) {
    throw new CustomErrors.BadRequestError("practitioner ID is required");
  }
  const dayStartDateTime = moment(`${dayDateString} ${dayStartHour}`);
  const dayEndDateTime = dayStartDateTime.clone().add(8, "hours");
  let currentSlotTime = dayStartDateTime.clone();
  const slotDocs = [];
  while (currentSlotTime.isBefore(dayEndDateTime)) {
    slotDocs.push({
      startDateTime: currentSlotTime.toDate(),
      practitioner: practitionerID,
    });
    currentSlotTime = currentSlotTime.add(15, "minutes");
  }
  const slots = await AppointmentTimeSlotModel.insertMany(slotDocs);
  response.json({
    count: slots.length,
    slots,
  });
};

module.exports = { createDaySlotsForPractitioner };
