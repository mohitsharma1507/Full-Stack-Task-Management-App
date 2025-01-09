const {
  Register,
  Login,
  logout,
  renderloginForm,
  renderregisterForm,
} = require("../Controller/user.js");
const router = require("express").Router();

router.get("/Register", renderregisterForm);
router.post("/Register", Register);
router.get("/Login", renderloginForm);
router.post("/Login", Login);
router.get("/logout", logout);

module.exports = router;
