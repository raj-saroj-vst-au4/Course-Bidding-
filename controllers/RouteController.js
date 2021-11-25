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
      if (data.verified && !data.bidding_complete) {
        course_som.find({}, (err, data) => {
          if (err) {
            console.log(err);
          }
          return res.render("bidding-page", { layout: "portal", data: data });
        });
      } else if (!data.verified) {
        return res.send(
          "Please Check your IITB Email and Confirm Verification"
        );
      } else {
        return res.render("bidding-complete", { layout: "portal" });
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

RouteController.renderStats = (req, res) => {
  return res.render("stats-page", { layout: "portal" });
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
          });
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

RouteController.biddingHandler = async (req, res) => {
  for (let i in req.body.bid_dataArray) {
    console.log(
      `${req.body.bid_dataArray[i].course_code} - ${req.body.bid_dataArray[i].bid}`
    );
    await course_som.findOneAndUpdate(
      { course_code: req.body.bid_dataArray[i].course_code },
      {
        $push: {
          course_students: {
            $each: [
              {
                student_email: req.session.username,
                student_bid: req.body.bid_dataArray[i].bid,
              },
            ],
            $sort: { student_bid: -1 },
          },
        },
      }
    );
  }
  await student_som.findOneAndUpdate(
    { student_email: req.session.username },
    { $inc: { bidding_complete: 1 } },
    (error, data) => {
      if (data) {
        return res.status(200).send("All Bids Successfully Placed");
      } else {
        return res.status(500).send("Invalid or Expired Token request");
      }
    }
  );
};

RouteController.fetchBidRange = async (req, res) => {
  console.log("Fetching bid range");
  const course_code = req.body.course_code;
  await course_som.findOne(
    {
      course_code: course_code,
    },
    (err, data) => {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      if (data.course_students.length) {
        console.log(
          `First element ${data.course_students[0]}, Last Element ${
            data.course_students.slice(-1)[0]
          }`
        );
        const max_bid = data.course_students[0].student_bid;
        const min_bid = data.course_students.slice(-1)[0].student_bid;
        return res.status(200).send({ max: max_bid, min: min_bid });
      }
    }
  );
  console.log("Insufficient bids till now");
  return res.status(404).send("Not Enough Bids till now");
};

RouteController.resetMyBid = async (req, res) => {
  console.log(`Resetting Bids for ${req.session.username}`);
  await student_som.findOne(
    { student_email: req.session.username },
    (err, student) => {
      if (!student.bidding_resets) {
        return res.status(201).send("You have exhausted your reset limit");
      }
    }
  );

  await course_som.updateMany(
    {},
    {
      $pull: {
        course_students: { student_email: req.session.username },
      },
    },
    (err, data) => {
      if (err) {
        console.log(err);
      }
      student_som.updateOne(
        {
          student_email: req.session.username,
        },
        { $inc: { bidding_resets: -1, bidding_complete: -1 } },
        { multi: true },
        (err, data) => {
          if (err) {
            return console.log(err);
          }
          return res.status(200).send("Your bids have been reset");
        }
      );
    }
  );
};
// const checkBidStatus = async (req) => {
//   await student_som.findOne(
//     { student_email: req.session.username },
//     (err, result) => {
//       if (result.bidding_complete) {
//         return true;
//       }
//     }
//   );
// };

RouteController.clearBid = async (req, res) => {
  console.log("Clearing all student bids");
  await course_som.updateMany({}, { $set: { course_students: [] } });
};

module.exports = RouteController;
