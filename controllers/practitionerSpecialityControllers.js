const PractitionerSpecialityModel = require("../models/PractitionerSpeciality");
const { StatusCodes } = require("http-status-codes");

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

module.exports = { createSpeciality, getSpecialities };
