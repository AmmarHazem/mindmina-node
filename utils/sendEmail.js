const nodemailer = require("nodemailer");

const sendEmail = ({ to, from = "Ammar <ammar@email.com>", subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "darius.kuhic5@ethereal.email",
      pass: "vhzxkrWtvFemdBfeDV",
    },
  });
  return transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
