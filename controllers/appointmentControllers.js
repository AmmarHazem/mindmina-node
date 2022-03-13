const moment = require("moment");
const { StatusCodes } = require("http-status-codes");
const AppointmentModel = require("../models/Appointment");
const AppointmentTimeSlotModel = require("../models/AppointmentTimeSlot");
const CustomErrors = require("../errors");

const getCurrentCustomerAppointments = async (request, response) => {
  const { startDate, endDate } = request.params;
  // if (!startDate || !endDate) {
  //   throw new CustomErrors.BadRequestError("start and end date are required");
  // }
  const appointments = await AppointmentModel.find({
    customer: request.user.id,
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

module.exports = { bookAppointment };
