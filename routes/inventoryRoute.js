// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to handle vehicle details
router.get("/detail/:inventoryId", invController.buildByInventoryId);
// Route to get a specific vehicle by ID
router.get('/vehicle/:inventoryId', invController.buildByInventoryId);



module.exports = router;