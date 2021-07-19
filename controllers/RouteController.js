const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const session = require("express-session");

const student_som = require("./../models/Student");
const course_som = require("./../models/Subject");
const mailer = require("./../mailer");

const JWTSECRET = "ysgfa7823y7h23g412h94yg49#@g3g*^&r78(*g72387rg23";

const RouteController = {};

RouteController.renderPortal = async (req, res) => {
  await student_som.findOne(
    { student_email: req.session.username },
    (err, data) => {
      //if(data.verified)
      if (data.verified) {
        course_som.find({}, (err, data) => {
          if (err) {
            console.log(err);
          }
          return res.render("bidding-page", { layout: 'portal', data: data });
        });
      } else {
        return res.send(
          "Please Check your IITB Email and Confirm Verification"
        );
      }
    }
  );
};

RouteController.renderLogin = (req, res) => {
  return res.render("login");
};

RouteController.renderRegister = (req, res) => {
  return res.render("register");
};

RouteController.logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/login");
};

RouteController.login = async (req, res) => {
  await student_som.findOne(
    { student_email: req.body.student_email },
    (err, data) => {
      if (data) {
        bcrypt.compare(
          req.body.student_pass,
          data.student_pass,
          (err, result) => {
            if (err) {
              console.log(err);
              return res.sendStatus(500);
            }
            if (result) {
              req.session.loggedIn = true;
              req.session.username = req.body.student_email;
              return res.sendStatus(200);
            } else {
              return res.sendStatus(401);
            }
          }
        );
      }
    }
  );
};

RouteController.registerStudent = async (req, res) => {
  const new_student = req.body;
  const new_student_name =
    new_student.nstudent_fname + " " + new_student.nstudent_lname;
  const token = jwt.sign({ email: new_student.nstudent_email }, JWTSECRET);
  const hashedPassword = await bcrypt.hash(new_student.nstudent_pass, 10);

  await student_som.findOne(
    { student_email: new_student.nstudent_email },
    (err, stdnt) => {
      if (stdnt) {
        return res.sendStatus(409);
      } else {
        const Student = new student_som({
          student_name: new_student_name,
          student_email: new_student.nstudent_email,
          student_pass: hashedPassword,
          confirmationCode: token,
        })
        .save()
        .then(() => {
            mailer.sendConfirmation(new_student, token);
            return res.sendStatus(200);
          })
      }
    }
  );
};

RouteController.verifyRegistration = async (req, res) => {
  await student_som.findOneAndUpdate(
    { confirmationCode: req.params.tokenCode },
    { $set: { verified: true, credits_left: 120 } },
    (err, data) => {
      if (err) {
        console.log(err);
      }
      if (data) {
        return res.redirect("/login");
      } else {
        return res.send("Invalid or Expired Token request");
      }
    }
  );
};


RouteController.bid = async (req, res) => {
  console.log(req.body)
}

module.exports = RouteController;
