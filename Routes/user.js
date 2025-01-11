const {
  Register,
  Login,
  logout,
  renderloginForm,
  renderregisterForm,
} = require("../Controller/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const router = require("express").Router();

router.get("/Register", renderregisterForm);
router.post("/Register", Register);
router.get("/Login", renderloginForm);
router.post(
  "/Login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  Login
);
router.get("/logout", logout);

module.exports = router;
