const createRequestUser = ({ user }) => {
  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    name: user.name,
    isEmailVerified: user.isEmailVerified,
  };
};

module.exports = createRequestUser;
