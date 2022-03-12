const jwt = require("jsonwebtoken");

const createJWT = ({ payload, expiresIn = "1h" }) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const createJWTAccessToken = ({ user }) => {
  return createJWT({ payload: { user } });
};

const createJWTRefreshToken = ({ user, refreshToken }) => {
  return createJWT({ payload: { user, refreshToken }, expiresIn: "1d" });
};

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
  createJWTAccessToken,
  createJWTRefreshToken,
  isTokenValid,
};
