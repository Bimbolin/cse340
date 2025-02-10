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


// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  Util.handleErrors(accountController.accountLogin)
)

// Default route for account management
router.get("/", Util.checkLogin, Util.handleErrors(accountController.buildManagement))


// Route to display the update account information form
router.get("/update/:account_id", Util.handleErrors(accountController.buildUpdateAccount));

// Route to handle the form submission for updating account information
router.post("/update/:account_id", Util.handleErrors(accountController.updateAccount));




module.exports = router;

