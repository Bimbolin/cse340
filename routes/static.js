const express = require('express');
const router = express.Router();
const baseController = require("../controllers/baseController");


// Static Routes
// Set up "public" folder / subfolders for static files
router.use(express.static("public"));
router.use("/css", express.static(__dirname + "public/css"));
router.use("/js", express.static(__dirname + "public/js"));
router.use("/images", express.static(__dirname + "public/images"));

// Route to trigger an error
router.get("/trigger-error", (req, res, next) => {
    next(new Error("Intentional server error for testing"));
  });
  

module.exports = router;



