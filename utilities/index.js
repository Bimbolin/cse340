const invModel = require("../models/inv_model")
const pool = require("../database/index");
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


// Example utility function
Util.buildInventoryView = async function (data) {
  let viewDetail = ""
          viewDetail += '<ul>'
          viewDetail += '<li>'
          viewDetail += '<img scr=" '+ data.inv_image +' "</img>'
          viewDetail += '<h2> $'+ data.inv_price + '</h2>'
          viewDetail += '<p>'+ data.inv_description + '</p>'
          viewDetail += '</li>'
          viewDetail += '</ul>'
  return viewDetail        
}

// Function to build classification list
Util.buildClassificationList = async (classification_id = null) => {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

// Function to build the Add Inventory view
Util.buildAddInventoryView = async function () {
  let classificationList = await Util.buildClassificationList();
  let viewAddInv = "";
  viewAddInv += '<form class="add-inventory-form" action="/inv/add-inventory" method="POST">';
  viewAddInv += '<label for="classificationList">Choose a classification:</label>';
  viewAddInv += classificationList;
  viewAddInv += '<br><br>';
  viewAddInv += '<label for="inv_make">Make:</label>';
  viewAddInv += '<input type="text" id="inv_make" name="inv_make" required><br><br>';
  viewAddInv += '<label for="inv_model">Model:</label>';
  viewAddInv += '<input type="text" id="inv_model" name="inv_model" required><br><br>';
  viewAddInv += '<label for="inv_description">Description:</label>';
  viewAddInv += '<textarea id="inv_description" name="inv_description" required></textarea><br><br>';
  viewAddInv += '<label for="inv_price">Price:</label>';
  viewAddInv += '<input type="number" step="0.01" id="inv_price" name="inv_price" required><br><br>';
  viewAddInv += '<label for"inv_year">Year:</label>';
  viewAddInv += '<input type="number" id="inv_year" name="inv_year" required><br><br>';
  viewAddInv += '<label for="inv_image">Image Path:</label>';
  viewAddInv += '<input type="text" id="inv_image" name="inv_image" required><br><br>'
  viewAddInv += '<label for="inv_thumbnail">Thumbnail Path:</label>';
  viewAddInv += '<input type="text" id="inv_thumbnail" name="inv_thumbnail" required><br><br>';
  viewAddInv += '<label for="inv_miles">Miles:</label>';
  viewAddInv += '<input type="number" id="inv_miles" name="inv_miles" required><br><br>';
  viewAddInv += '<label for="inv_color">Color:</label>';
  viewAddInv += '<input type="text" id="inv_color" name="inv_color" required><br><br>';
  viewAddInv += '<button type="submit">Add Inventory</button>';   
  viewAddInv += '</form>';
  return viewAddInv;
};



/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util