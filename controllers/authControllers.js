const crypto = require("crypto");
const { StatusCodes } = require("http-status-codes");
const sendVerificationEmail = require("../utils/sendVerificationEmail");
const UserModel = require("../models/User");
const CustomErrors = require("../errors");
const createRequestUser = require("../utils/createRequestUser");
const TokenModel = require("../models/Token");
const { origin } = require("../constants");
const { createJWTAccessToken, createJWTRefreshToken } = require("../utils/jwt");
const jwt = require("jsonwebtoken");

const logout = async (request, response) => {
  const refreshToken = request.body.refreshToken;
  if (!refreshToken) {
    throw new CustomErrors.BadRequestError("refresh token is required");
  }
  const token = await TokenModel.findOne({ refreshToken });
  if (!token) {
    return response.status(StatusCodes.OK).send();
  }
  token.expiryDate = Date.now();
  await token.save();
  response.status(StatusCodes.OK).send();
};

const refreshToken = async (request, response) => {
  const refreshTokenJWT = request.body.refreshToken;
  if (!refreshTokenJWT) {
    throw new CustomErrors.BadRequestError("refresh token is required");
  }
  const jwtPayload = jwt.verify(refreshTokenJWT, process.env.JWT_SECRET);
  const refreshToken = jwtPayload.refreshToken;
  const existingToken = await TokenModel.findOne({
    refreshToken: refreshToken,
  }).populate("user", "email name role isEmailVerified");
  if (!existingToken || !existingToken.isValid) {
    throw new CustomErrors.BadRequestError("invalid or expired refresh token");
  }
  const requestUser = createRequestUser({ user: existingToken.user });
  const accessTokenJWT = createJWTAccessToken({ user: requestUser });
  // const newRefreshTokenJWT = createJWTRefreshToken({
  //   user: requestUser,
  //   refreshToken: refreshTokenJWT,
  // });
  response.json({
    user: requestUser,
    accessToken: accessTokenJWT,
    refreshToken: refreshTokenJWT,
  });
};

const login = async (request, response) => {
  const { email, password } = request.body;
  if (!email || !password) {
    throw new CustomErrors.BadRequestError("email and password are required");
  }
  // const hashedPassword = await hashPassword({ password });
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new CustomErrors.BadRequestError("invalid credentials");
  }
  const passwordMatch = await user.comparePassword(password);
  if (!passwordMatch) {
    throw new CustomErrors.BadRequestError("invalid credentials");
  }
  if (!user.isEmailVerified) {
    throw new CustomErrors.BadRequestError("please verify your email first");
  }
  let refreshToken;
  const existingToken = await TokenModel.findOne({ user: user._id });
  if (existingToken && existingToken.isValid) {
    refreshToken = existingToken.refreshToken;
  } else {
    refreshToken = crypto.randomBytes(40).toString("hex");
    await TokenModel.create({
      refreshToken: refreshToken,
      ip: request.ip,
      userAgent: request.headers["user-agent"],
      user: user._id,
    });
  }
  if (existingToken && !existingToken.isValid) {
    await existingToken.remove();
  }
  // console.log("--- login token valid", existingToken.isValid);
  const requestUser = createRequestUser({ user });
  const accessTokenJWT = createJWTAccessToken({ user: requestUser });
  const refreshTokenJWT = createJWTRefreshToken({
    user: requestUser,
    refreshToken: refreshToken,
  });
  response.json({
    user: requestUser,
    accessToken: accessTokenJWT,
    refreshToken: refreshTokenJWT,
  });
};

const verifyEmail = async (request, response) => {
  const { verificationToken, email } = request.body;
  if (!verificationToken || !email) {
    throw new CustomErrors.BadRequestError("invalid token");
  }
  const user = await UserModel.findOne({
    email,
    emailVerificationToken: verificationToken,
  });
  if (!user) {
    throw new CustomErrors.BadRequestError("invalid token");
  }
  user.isEmailVerified = true;
  user.emailVerificationToken = "";
  user.emailVerificationDate = Date.now();
  await user.save();
  const requestUser = createRequestUser({ user });
  const existingToken = await TokenModel.findOne({ user: user.id });
  const accessTokenJWT = createJWTAccessToken({ user: requestUser });
  let refreshTokenJWT;
  if (existingToken && existingToken.isValid) {
    refreshTokenJWT = createJWTRefreshToken({
      user: requestUser,
      refreshToken: existingToken.refreshToken,
    });
  } else {
    const refreshToken = crypto.randomBytes(40).toString("hex");
    refreshTokenJWT = createJWTRefreshToken({
      user: requestUser,
      refreshToken: refreshToken,
    });
    await TokenModel.create({
      refreshToken: refreshToken,
      ip: request.ip,
      userAgent: request.headers["user-agent"],
      user: user._id,
    });
  }
  if (existingToken && !existingToken.isValid) {
    await existingToken.remove();
  }
  response.json({
    success: true,
    message: "email verified",
    user: requestUser,
    accessToken: accessTokenJWT,
    refreshToken: refreshTokenJWT,
  });
};

const register = async (request, response) => {
  const { email, name, password, role, clinic, practitionerSpecialities } =
    request.body;
  if (!email || !name || !password) {
    throw new CustomErrors.BadRequestError(
      "email, name and password are required"
    );
  }
  const usersCount = await UserModel.countDocuments({});
  const isFirstUser = usersCount === 0;
  const userRole = isFirstUser ? "admin" : role || "customer";
  const emailVerificationToken = crypto.randomBytes(40).toString("hex");
  const user = await UserModel.create({
    email,
    name,
    password,
    emailVerificationToken,
    role: userRole,
    clinic,
    practitionerSpecialities,
  });
  sendVerificationEmail({
    verificationToken: emailVerificationToken,
    origin,
    name: user.name,
    email: user.email,
  });
  response.status(StatusCodes.CREATED).json({
    message: "Please check yout email for verification message",
    user: createRequestUser({ user }),
  });
};

module.exports = {
  register,
  verifyEmail,
  login,
  refreshToken,
  logout,
};
