const UserModel = require("../models/User");
const CustomErrors = require("../errors");

const getCurrentClinicPractitioners = async (request, response) => {
  const practitioners = await UserModel.find({
    clinic: request.user.id,
  }).select(
    "name email role isEmailVerified emailVerificationDate updatedAt clinic"
  );
  response.json({
    count: practitioners.length,
    practitioners,
  });
};

const deleteUser = async (request, response) => {
  const userID = request.params.id;
  if (!userID) {
    throw new CustomErrors.BadRequestError("user ID is required");
  }
  const user = await UserModel.findById(userID);
  if (!user) {
    throw new CustomErrors.NotFoundError("user not found");
  }
  await user.remove();
  //   await UserModel.findByIdAndDelete(userID);
  response.json({ success: true });
};

const getAllPractitioners = async (request, response) => {
  const practitioners = await UserModel.find({ role: "practitioner" })
    .select("email name role")
    .populate("slots");
  return response.json({
    count: practitioners.length,
    practitioners,
  });
};

module.exports = {
  getAllPractitioners,
  deleteUser,
  getCurrentClinicPractitioners,
};
