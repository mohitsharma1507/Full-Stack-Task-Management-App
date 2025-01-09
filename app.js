require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const user = require("./Routes/user");
const ejsMate = require("ejs-mate");
const ExpressError = require("../Backend/views/utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const jwt = require("jsonwebtoken");

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
app.use(express.json());

app.engine("ejs", ejsMate);

app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.json());
const dbUrl = process.env.ATLAS_URL;
main()
  .then((res) => {
    console.log("successfull");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  const token = req.cookies.jwt;
  res.locals.token = token ? jwt.verify(token, process.env.SECRET) : null;
  next();
});

app.use("/", user);
// Middleware Adding

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;

  res.status(status).render("error.ejs", { message });
});

app.listen(5000, () => {
  console.log("serving is working now");
});
