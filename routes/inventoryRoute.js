const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const validate = require("../utilities/account-validation");
const Util = require("../utilities/");
const authMiddleware = require("../utilities/authMiddleware");


// Route to deliver the management view
router.get("/", invController.buildManagement);

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to handle vehicle details
router.get("/detail/:inventoryId", invController.buildByInventoryId);

// Route to get a specific vehicle by ID
router.get("/vehicle/:inventoryId", invController.buildByInventoryId);

// Route to display the add classification form
router.get("/add-classification", authMiddleware.checkAdminOrEmployee,  invController.buildAddClassification);

// Route to handle the form submission
router.post("/add-classification", authMiddleware.checkAdminOrEmployee,   validate.classificationRules(), validate.checkClassificationData, invController.addClassification);

// Route to display the add inventory form
router.get("/add-inventory", authMiddleware.checkAdminOrEmployee,  invController.buildAddInventory);

// Route to handle the form submission for inventory
router.post("/add-inventory", authMiddleware.checkAdminOrEmployee,  /*validate.inventoryRules(), validate.checkInventoryData,*/ invController.addInventory);

// Route to display the edit inventory form
router.get("/edit/:inventory_id", authMiddleware.checkAdminOrEmployee,  Util.handleErrors(invController.buildEditInventory));


router.get("/management", invController.buildManagementView);
router.get("/view-by-classification", invController.buildByClassificationId);
router.get("/getInventory/:classification_id", Util.handleErrors(invController.getInventoryJSON));

module.exports = router;

