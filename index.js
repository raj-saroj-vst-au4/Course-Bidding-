const express = require("express");
const mongoose = require("mongoose");
const handlebars = require("express-handlebars");
const session = require("express-session");

//Declarations
const app = express();
const PORT = process.env.PORT || 8008;

//Dependencies
const RouteController = require("./controllers/RouteController");
const course_som = require("./models/Subject");
const student_som = require("./models/Student");

//App usage extensions
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "handlebars");
app.engine(
  "handlebars",
  handlebars({
    layoutsDir: `${__dirname}/views/layouts`,
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
    helpers: {
      ifeq: function (a, b, options) {
        if (parseInt(a) == b) {
          return options.fn(this);
        }
        return options.inverse(this);
      },
    },
  })
);

//App Session
app.use(
  session({
    secret: "ioj2359832j5j32@89583$29h^58h3&985*h92h35(h59!32h58h",
    saveUninitialized: false,
    resave: false,
  })
);

//Authentication Middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/login");
  }
};
const isNotAuthenticated = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};

//Render Routes
app.get("/", isAuthenticated, RouteController.renderPortal);

app.get("/login", isNotAuthenticated, RouteController.renderLogin);

app.get("/register", isNotAuthenticated, RouteController.renderRegister);

app.get("/logout", isAuthenticated, RouteController.logout);

app.get("/addcourse", (req, res) => {
  res.render("addcourse");
});

//auth routes
app.post("/api/auth/login", RouteController.login);

app.post("/api/auth/signup", RouteController.registerStudent);

app.post("/api/addCourse", (req, res) => {
  const course = new course_som({
    course_code: req.body.course_code,
    course_name: req.body.course_name,
    course_faculty: req.body.course_fac,
    course_credits: req.body.course_cred,
    course_seats: req.body.course_seats,
    course_term: req.body.course_term,
  })
    .save()
    .then(() => console.log("Added Course"));
});

app.get(
  "/api/verifyRegistration/:tokenCode",
  RouteController.verifyRegistration
);

//app.get("/api/verifyReset/:tokenCode", RouteController.verifyReset);

//Bidding routes

app.post(
  "/api/bidding-handler",
  isAuthenticated,
  RouteController.biddingHandler
);

// app.post("/api/clear-bid", RouteController.clearBid);

mongoose
  .connect(
    "mongodb+srv://r4id:khuljasimsim@r4id-cluster.fwjpl.mongodb.net/course_bidding_portal?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Mongodb connected");
    app.listen(PORT, () => {
      console.log(`server is working now on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
