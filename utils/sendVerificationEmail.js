const sendEmail = require("./sendEmail");

const sendVerificationEmail = ({ verificationToken, origin, name, email }) => {
  const verifyEmailLink = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
  const message = `<p>Please confirm your email by clicking on the following</p><a href="${verifyEmailLink}">link</a>`;
  return sendEmail({
    to: email,
    subject: "Email Verification",
    html: `<h4>Hello, ${name}</h4> ${message}`,
  });
};

module.exports = sendVerificationEmail;
