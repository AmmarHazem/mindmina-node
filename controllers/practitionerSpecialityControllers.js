const { StatusCodes } = require("http-status-codes");
const UserModel = require("../models/User");
const PractitionerSpecialityModel = require("../models/PractitionerSpeciality");
const CustomErrors = require("../errors/index");

const addSpecialityToPractitioner = async (request, response) => {
  const { practitionerID, speciality } = request.body;
  if (!practitionerID || !speciality) {
    throw new CustomErrors.BadRequestError(
      "practitioner id and speciality id are requierd"
    );
  }
  const practitioner = await UserModel.findOne({
    _id: practitionerID,
    role: "practitioner",
  });
  if (!practitioner) {
    throw new CustomErrors.NotFoundError("practitioner not found");
  }
  const specialities = practitioner.practitionerSpecialities || [];
  practitioner.practitionerSpecialities = [...specialities, speciality];
  await practitioner.save();
  response.json({ practitioner });
};

const getSpecialities = async (request, response) => {
  const specialities = await PractitionerSpecialityModel.find({});
  response.json({
    count: specialities.length,
    specialities,
  });
};

const createSpeciality = async (request, response) => {
  const { name } = request.body;
  const speciality = await PractitionerSpecialityModel.create({ name });
  response.status(StatusCodes.CREATED).json({ speciality });
};

module.exports = {
  createSpeciality,
  getSpecialities,
  addSpecialityToPractitioner,
};
