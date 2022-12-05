const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  host: "mail.wyroam.com",
  port: 465,
  auth: {
    user: "logasmail@wyroam.com",
    pass: "logasmail123",
  },
});

const sendMail = (data) => {
transporter.sendMail(data, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }
});
}

module.exports = sendMail;
