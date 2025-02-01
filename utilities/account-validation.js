const Util = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}
const accountModel = require("../models/account-model");




/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
    const emailExists = await accountModel.checkExistingEmail(account_email)
    if (emailExists){
      throw new Error("Email exists. Please log in or use different email")
    }
  }),
    // password is required and must be strong password
    body("account_password")
    .trim()
    .notEmpty()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password does not meet requirements."),
]
}

/*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),
    body("account_password")
      .trim()
      .isLength({ min: 12 })
      .withMessage("Password must be at least 12 characters long."),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await Util.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await Util.getNav();
    res.render("account/login", {
      errors: errors.array(),
      title: "Login",
      nav,
      account_email,
    });
    return;
  }
  next();
};

/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Classification name must contain only letters and numbers."),
  ];
};

/* ******************************
 * Check data and return errors or continue
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await Util.getNav();
    res.render("inventory/add-classification", {
      errors: errors.array(),
      title: "Add Classification",
      nav,
    });
    return;
  }
  next();
};

/*  **********************************
  *  Inventory Data Validation Rules
  * ********************************* */
validate.inventoryRules = () => {
  return [
    body("classification_id").isInt().withMessage("Classification ID is required."),
    body("inv_make").trim().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().notEmpty().withMessage("Model is required."),
    body("inv_description").trim().notEmpty().withMessage("Description is required."),
    body("inv_price").isDecimal().withMessage("Price must be a valid number."),
    body("inv_image").trim().notEmpty().withMessage("Image path is required."),
    body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required."),
    body("inv_miles").isInt().withMessage("Miles must be a valid number."),
    body("inv_color").trim().notEmpty().withMessage("Color is required.")
  ];
};

/* ******************************
 * Check data and return errors or continue
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await Util.getNav();
    let classificationList = await Util.buildClassificationList(req.body.classification_id);
    res.render("inventory/add-inventory", {
      errors: errors.array(),
      title: "Add Inventory",
      nav,
      classificationList,
      ...req.body
    });
    return;
  }
  next();
};

module.exports = validate; 

