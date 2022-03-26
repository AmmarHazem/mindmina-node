const moment = require("moment");
const { StatusCodes } = require("http-status-codes");
const AppointmentModel = require("../models/Appointment");
const AppointmentTimeSlotModel = require("../models/AppointmentTimeSlot");
const CustomErrors = require("../errors");

const endAppointmentByCustomer = async (request, response) => {
  const { appointmentID } = request.body;
  if (!appointmentID) {
    throw new CustomErrors.BadRequestError("appointmnet ID is required");
  }
  const appointment = await AppointmentModel.findById(appointmentID).populate(
    "slot",
    "isBooked"
  );
  if (!appointment) {
    throw new CustomErrors.NotFoundError("appointment not found");
  }
  if (appointment.customer.toString() !== request.user.id) {
    throw new CustomErrors.NotFoundError("invalid appointment ID");
  }
  if (!appointment.slot || !appointment.slot.isBooked) {
    throw new CustomErrors.NotFoundError("appointmnet not found");
  }
  if (!appointment.endedByCustomer) {
    appointment.endedByCustomer = true;
    appointment.dateEndedByCustomer = new Date();
    await appointment.save();
  }
  response.json({ appointment });
};

const endAppointmentByPractitioner = async (request, response) => {
  const { appointmentID } = request.body;
  if (!appointmentID) {
    throw new CustomErrors.BadRequestError("appointmnet ID is required");
  }
  const appointment = await AppointmentModel.findById(appointmentID).populate(
    "slot",
    "isBooked"
  );
  if (!appointment) {
    throw new CustomErrors.NotFoundError("appointment not found");
  }
  if (appointment.practitioner.toString() !== request.user.id) {
    throw new CustomErrors.NotFoundError("invalid appointment ID");
  }
  if (!appointment.slot || !appointment.slot.isBooked) {
    throw new CustomErrors.NotFoundError("appointmnet not found");
  }
  if (!appointment.endedByPractitioner) {
    appointment.endedByPractitioner = true;
    appointment.dateEndedByPractitioner = new Date();
    await appointment.save();
  }
  response.json({ appointment });
};

const joinAppointmentByCustomer = async (request, response) => {
  const { appointmentID } = request.body;
  if (!appointmentID) {
    throw new CustomErrors.BadRequestError("appointmnet ID is required");
  }
  const appointment = await AppointmentModel.findById(appointmentID).populate(
    "slot",
    "startDateTime endDateTime duration isBooked"
  );
  if (!appointment) {
    throw new CustomErrors.NotFoundError("appointment not found");
  }
  if (appointment.customer.toString() !== request.user.id) {
    throw new CustomErrors.BadRequestError("invalid appointment id");
  }
  if (!appointment.startedByPractitioner || appointment.endedByPractitioner) {
    throw new CustomErrors.BadRequestError(
      "appointment is not started or already ended by practitioner"
    );
  }
  if (!appointment.slot || !appointment.slot.isBooked) {
    throw new CustomErrors.NotFoundError("appointmnet not found");
  }
  const timeSlot = appointment.slot;
  const now = moment();
  const slotStartDateTime = moment(timeSlot.startDateTime);
  const slotEndDateTime = moment(
    timeSlot.endDateTime ||
      slotStartDateTime.clone().add(timeSlot.duration, "seconds")
  );
  if (now.isSameOrAfter(slotEndDateTime)) {
    throw new CustomErrors.BadRequestError(
      "appointmnet must be started before its end time"
    );
  }
  if (!appointment.joinedByCustomer) {
    appointment.joinedByCustomer = true;
    appointment.dateJoinedByCustomer = new Date();
    await appointment.save();
  }
  response.json({ appointment });
};

const startAppointmentByPractitioner = async (request, response) => {
  const { appointmentID } = request.body;
  if (!appointmentID) {
    throw new CustomErrors.BadRequestError("appointmnet ID is required");
  }
  // console.log("--- started date", new Date());
  const appointment = await AppointmentModel.findById(appointmentID).populate(
    "slot",
    "startDateTime endDateTime duration isBooked"
  );
  if (!appointment) {
    throw new CustomErrors.NotFoundError("appointment not found");
  }
  // console.log(
  //   "--- practitioner id",
  //   appointment.practitioner.toString(),
  //   typeof appointment.practitioner.toString()
  // );
  if (appointment.practitioner.toString() !== request.user.id) {
    throw new CustomErrors.NotFoundError("invalid appointment ID");
  }
  if (appointment.endedByPractitioner) {
    throw new CustomErrors.BadRequestError(
      "appointment is already ended by practitioner"
    );
  }
  if (!appointment.slot || !appointment.slot.isBooked) {
    throw new CustomErrors.NotFoundError("appointmnet not found");
  }
  const timeSlot = appointment.slot;
  const now = moment();
  const slotStartDateTime = moment(timeSlot.startDateTime);
  const slotEndDateTime = moment(
    timeSlot.endDateTime ||
      slotStartDateTime.clone().add(timeSlot.duration, "seconds")
  );
  if (now.isBefore(slotStartDateTime) || now.isSameOrAfter(slotEndDateTime)) {
    throw new CustomErrors.BadRequestError(
      "appointmnet must be started at start time and before its end time"
    );
  }
  if (!appointment.startedByPractitioner) {
    appointment.startedByPractitioner = true;
    appointment.dateStartedByPractitioner = new Date();
    await appointment.save();
  }
  // const appointment = await AppointmentModel.findByIdAndUpdate(
  //   appointmentID,
  //   {
  //     startedByPractitioner: true,
  //     dateStartedByPractitioner: new Date(),
  //   },
  //   { new: true, runValidators: true }
  // );
  response.json({ appointment });
};

const getCurrentPractitionerAppointments = async (request, response) => {
  const { startDate, endDate } = request.query;
  const queryObject = {
    practitioner: request.user.id,
    isBooked: true,
  };
  if (startDate) {
    queryObject.startDateTime = { $gte: moment(startDate).toDate() };
  }
  if (endDate) {
    queryObject.startDateTime = { $lte: moment(endDate).toDate() };
  }
  if (!startDate && !endDate) {
    queryObject.startDateTime = { $gte: new Date() };
  }
  const timeSlots = await AppointmentTimeSlotModel.find(queryObject);
  const timeSlotsIDs = timeSlots.map((item) => item._id);
  const appointments = await AppointmentModel.find({
    slot: { $in: timeSlotsIDs },
  }).populate("slot");
  response.json({
    count: appointments.length,
    appointments,
  });
};

const getCurrentCustomerAppointments = async (request, response) => {
  const { startDate, endDate } = request.query;
  const queryObject = {};
  if (startDate) {
    queryObject.startDateTime = { $gte: moment(startDate).toDate() };
  }
  if (endDate) {
    queryObject.startDateTime = { $lte: moment(endDate).toDate() };
  }
  if (!startDate && !endDate) {
    queryObject.startDateTime = { $gte: new Date() };
  }
  const slots = await AppointmentTimeSlotModel.find(queryObject).select("_id");
  const slotIDs = slots.map((item) => item._id);
  const appointments = await AppointmentModel.find({
    slot: { $in: slotIDs },
    customer: request.user.id,
  }).populate("slot");
  // const appointments = await AppointmentModel.find({
  //   customer: request.user.id,
  // }).populate({
  //   path: "slot",
  //   match: queryObject,
  // });
  // const appointmentsWithSlots = appointments.filter(
  //   (item) => item.slot !== null
  // );
  response.json({
    count: appointments.length,
    appointments,
  });
};

const bookAppointment = async (request, response) => {
  const {
    slotID,
    residenceStatus,
    emiratesIDImageFront,
    emiratesIDImageBack,
    emiratesIDExpityDate,
    passportImage,
    passportNumber,
    passportExpiryDate,
    phoneNumber,
    gender,
    proceedWithFullPayment,
    voiceNoteURL,
    isInsured,
    insuranceProvider,
    insuranceID,
    reasonOfVisit,
  } = request.body;
  if (!slotID) {
    throw new CustomErrors.BadRequestError("slot ID is required");
  }
  if (!residenceStatus) {
    throw new CustomErrors.BadRequestError("residence status is required");
  }
  const mustHaveEmiratesID =
    residenceStatus === "citizen" || residenceStatus === "resident";
  if (mustHaveEmiratesID) {
    if (!emiratesIDImageFront) {
      throw new CustomErrors.BadRequestError(
        "emirates ID image front is required"
      );
    }
    if (!emiratesIDImageBack) {
      throw new CustomErrors.BadRequestError(
        "emirates ID image back is required"
      );
    }
    if (!emiratesIDExpityDate) {
      throw new CustomErrors.BadRequestError(
        "emirates ID expiry date is required"
      );
    }
  } else {
    if (!passportImage) {
      throw new CustomErrors.BadRequestError("passport image is required");
    }
    if (!passportNumber) {
      throw new CustomErrors.BadRequestError("passport number is required");
    }
    if (!passportExpiryDate) {
      throw new CustomErrors.BadRequestError(
        "passport expiry date is required"
      );
    }
  }
  if (!phoneNumber) {
    throw new CustomErrors.BadRequestError("phone number is required");
  }
  if (!gender) {
    throw new CustomErrors.BadRequestError("gender is required");
  }
  const slot = await AppointmentTimeSlotModel.findById(slotID);
  if (!slot || slot.isBooked) {
    throw new CustomErrors.BadRequestError(
      "invalid slot id or slot is aleady booked"
    );
  }
  const slotStartDateTime = moment(slot.startDateTime);
  const slotEndDateTime = moment(
    slot.endDateTime || slotStartDateTime.clone().add(slot.duration, "seconds")
  );
  const now = moment();
  if (now.isSameOrAfter(slotEndDateTime)) {
    throw new CustomErrors.BadRequestError(
      "invalid slot id or slot is aleady booked"
    );
  }
  const appointment = await AppointmentModel.create({
    slot: slotID,
    practitioner: slot.practitioner,
    customer: request.user.id,
    customerResidenceStatus: residenceStatus,
    customerPhoneNumber: phoneNumber,
    customerEmiratesIDImageFront: emiratesIDImageFront,
    customerEmiratesIDImageBack: emiratesIDImageBack,
    customerEmiratesIDExpiryDate: moment(emiratesIDExpityDate).toDate(),
    customerPassportImage: passportImage,
    customerPassportNumber: passportNumber,
    customerPassportExpiryDate: moment(passportExpiryDate).toDate(),
    customerGender: gender,
    customerIsInsured: isInsured,
    customerInsuranceProvider: insuranceProvider,
    customerInsuranceID: insuranceID,
    customerReasonOfVisit: reasonOfVisit,
    doFullPayment: proceedWithFullPayment,
    voiceNote: voiceNoteURL,
  });
  slot.isBooked = true;
  await slot.save();
  response.status(StatusCodes.CREATED).json({
    appointment,
  });
};

module.exports = {
  bookAppointment,
  getCurrentCustomerAppointments,
  getCurrentPractitionerAppointments,
  startAppointmentByPractitioner,
  joinAppointmentByCustomer,
  endAppointmentByPractitioner,
  endAppointmentByCustomer,
};
