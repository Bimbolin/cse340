const utilities = require("../utilities");
const accountModel = require("../models/account-model"); 
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const accountController = {};

/* ****************************************
*  Deliver login view
* *************************************** */
accountController.buildLogin = async (req, res) => {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: req.flash("error")
  })
}





/* ****************************************
*  Deliver registration view
* *************************************** */
accountController.buildRegister = async (req, res) => {
  let nav = await utilities.getNav();
  res.render("account/register", {
    errors: null,
    title: "Register",
    nav,
    errors: null,
  });
}



/* ****************************************
*  Process Registration
* *************************************** */
accountController.registerAccount = async (req, res) => {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
let hashedPassword
try {
  // regular password and cost (salt is generated automatically)
  hashedPassword = await bcrypt.hashSync(account_password, 10)
} catch (error) {
  req.flash("notice", 'Sorry, there was an error processing the registration.')
  res.status(500).render("account/register", {
    title: "Registration",
    nav,
    errors: null,
    account_firstname,
    account_lastname,
    account_email
    
  })
}

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: [],
      account_firstname,
      account_lastname,
      account_email
  
    })
  }
}


/*accountController.buildManagement = async (req, res) => {
  let nav = await utilities.getNav();
  const user = req.session.user;
  
  res.render("account/management", {
    title: "Account Management",
    nav,
    user,
    messages: req.flash('success') || req.flash('error'),
    errors: null
  });
}*/

/* ****************************************
 *  Process login request
 * ************************************ */
/*accountController.accountLogin = async (req, res) =>{
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}*/

accountController.accountLogin = async (req, res) => {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;  // Remove password from object
      req.session.user = accountData;  // ✅ Store user in session
      req.session.save(() => {  // ✅ Ensure session is saved before redirect
        return res.redirect("/account/management");
      });
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect("/account/login");
  }
};

accountController.buildManagement = async (req, res) => {
  let nav = await utilities.getNav();
  const user = req.session.user;

  if (!user) {
    req.flash("error", "You must be logged in to access this page.");
    return res.redirect("/account/login");
  }

  res.render("account/management", {
    title: "Account Management",
    nav,
    user,
    messages: req.flash("success") || req.flash("error"),
    errors: null,
  });
};

module.exports =  accountController;

