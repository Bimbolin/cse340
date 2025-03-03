/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const session = require("express-session")
const pool = require('./database/')
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const staticRoute = require("./routes/static")
const baseController = require("./controllers/baseController")
const accountRoute = require("./routes/accountRoute"); // Import account route
const bodyParser = require("body-parser")
const flash = require("connect-flash");
const cookieParser = require("cookie-parser")
// Import inventoryRoute
 const inventoryRoute = require("./routes/inventoryRoute");

// Import utilities module 
const utilities = require("./utilities");

// Serve static files from the public directory
app.use(express.static("public"));



/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) 

app.use(cookieParser())

app.use(utilities.checkJWTToken)

// Middleware to set loggedin state
app.use((req, res, next) => {
  res.locals.loggedin = req.session.user ? true : false;  
  res.locals.user = req.session.user || null;
  next();
});




// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
});


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(staticRoute);


//Index route
app.get("/", utilities.handleErrors(baseController.buildHome));
// Inventory routes
app.use("/inv", inventoryRoute);
app.use("/account", require("./routes/accountRoute")) // Add account route

const path = require("path");
const favicon = require("serve-favicon");

// Place this line after setting up the static file serving
app.use(favicon(path.join(__dirname, "public", "images", "site", "favicon-32x32.png")));



// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  });
});


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})