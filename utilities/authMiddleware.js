const jwt = require("jsonwebtoken");

const checkAdmin = (req, res, next) => {
  try {
    // Get JWT from cookies
    const token = req.cookies.jwt;
    
    if (!token) {
      req.flash("error", "You must be logged in as an Admin or Employee.");
      return res.redirect("/account/login");
    }

    // Verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        req.flash("error", "Invalid session. Please log in again.");
        return res.redirect("/account/login");
      }

      // Check user role
      if (decoded.account_type !== "Employee" && decoded.account_type !== "Admin") {
        req.flash("error", "Unauthorized access.");
        return res.redirect("/account/login");
      }

      // Pass user info to the request
      req.user = decoded;
      next();
    });

  } catch (error) {
    console.error("Auth Middleware Error:", error);
    req.flash("error", "Authentication failed.");
    res.redirect("/account/login");
  }
};

module.exports = checkAdmin;