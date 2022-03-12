const CustomErrors = require("../errors");

const hasPermissionMiddleware = (...roles) => {
  return (request, response, next) => {
    if (request.user && roles.includes(request.user.role)) {
      next();
    } else {
      throw new CustomErrors.UnauthorizedError("unauthorized");
    }
  };
};

module.exports = hasPermissionMiddleware;
