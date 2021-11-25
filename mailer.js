const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

const username = process.env.MAILER_ID;
const password = process.env.MAILER_PASS;

const email = {};

const smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: username,
    pass: password,
  },
});

email.sendConfirmation = (student, token) => {
  console.log("sending email to " + student.nstudent_email);
  smtpTransport.sendMail(
    {
      to: student.nstudent_email,
      subject: "Email Confirmation for Course Bidding Portal",
      html: `<h1>Hello ${student.nstudent_fname}, Please Click on the following link to verify your account to access course bidding portal: </h1><br><a href=${process.env.HOST}/api/verifyRegistration/${token}>Click to Verify</a>`,
    },
    (err, info) => {
      if (err) {
        return console.log(err);
      } else {
        return console.log(
          `Email confirmation sent to ${student.nstudent_email}`
        );
      }
    }
  );
};

email.sendPassReset = (student, token) => {
  smtpTransport.sendMail(
    {
      to: student.nstudent_email,
      subject: "Password Reset Link for Course Bidding Portal",
      html: `<h1>Hello ${student.student_name}, Please Click on the following link to reset your account password to access course bidding portal: </h1><br><a href=${process.env.HOST}/api/verifyPassReset/${token}>Click to Verify</a>`,
    },
    (err, info) => {
      if (err) {
        return console.log(err);
      } else {
        return console.log(
          `Email confirmation sent to ${student.nstudent_email}`
        );
      }
    }
  );
};

module.exports = email;
