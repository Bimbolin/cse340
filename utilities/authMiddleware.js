const jwt = require("jsonwebtoken");
const { SECRET } = process.env; // Ensure you have a secret key in your .env file

const checkAdminOrEmployee = (req, res, next) => {
  const token = req.cookies.jwt; // Assuming the JWT is stored in a cookie

  if (!token) {
    req.flash("error", "You must be logged in to view this page.");
    return res.redirect("/account/login");
  }

  try {
    const decoded = jwt.verify(token, SECRET);

    if (decoded.account_type === "Employee" || decoded.account_type === "Admin") {
      req.user = decoded;
      next();
    } else {
      req.flash("error", "You do not have the necessary permissions to view this page.");
      return res.redirect("/account/login");
    }
  } catch (err) {
    req.flash("error", "Invalid token. Please log in again.");
    return res.redirect("/account/login");
  }
};

module.exports = { checkAdminOrEmployee };
