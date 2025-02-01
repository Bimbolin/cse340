const express = require("express");
const router = express.Router();
const Util = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation')




// Route to handle the login page
router.get("/login", Util.handleErrors(accountController.buildLogin));
// Route to handle the registration page
router.get("/register", Util.handleErrors(accountController.buildRegister));
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  Util.handleErrors(accountController.registerAccount)
)


// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)


module.exports = router;

