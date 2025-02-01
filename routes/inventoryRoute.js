const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const validate = require("../utilities/account-validation")

// Route to deliver the management view
router.get("/", invController.buildManagement);

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to handle vehicle details
router.get("/detail/:inventoryId", invController.buildByInventoryId);

// Route to get a specific vehicle by ID
router.get("/vehicle/:inventoryId", invController.buildByInventoryId);

// Route to display the add classification form
router.get("/add-classification", invController.buildAddClassification);

// Route to handle the form submission
router.post("/add-classification", validate.classificationRules(), validate.checkClassificationData, invController.addClassification);

// Route to display the add inventory form
router.get("/add-inventory", invController.buildAddInventory);

// Route to handle the form submission for inventory
router.post("/add-inventory", validate.inventoryRules(), validate.checkInventoryData, invController.addInventory);

module.exports = router;
