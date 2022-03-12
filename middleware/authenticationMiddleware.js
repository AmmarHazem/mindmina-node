const jwt = require("jsonwebtoken");
const CustomErrors = require("../errors");

const authenticationMiddleware = (request, response, next) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomErrors.UnauthenticatedError("invalid token");
  }
  try {
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    request.user = payload.user;
    request.refreshToken = payload.refreshToken;
    request.token = token;
    next();
  } catch (e) {
    console.log("--- authMiddleware error");
    console.log(e);
    throw new CustomErrors.UnauthenticatedError("invalid token");
  }
};

module.exports = authenticationMiddleware;
