const mailSender = require("../utils/mailSender");

const sendEmail = async ({ to, subject, html }) => {
  return mailSender(to, subject, html);
};

module.exports = {
  sendEmail,
};
