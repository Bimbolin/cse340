const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");

// Route to handle the login page
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Export the router for use elsewhere
module.exports = router;

