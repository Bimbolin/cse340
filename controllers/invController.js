const invModel = require("../models/inv_model")
const Util = require("../utilities/")

const invController = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invController.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await Util.buildClassificationGrid(data)
  let nav = await Util.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invController.buildByInventoryId = async function (req, res) {
  const inventoryId = req.params.inventoryId;
  let nav = await Util.getNav()
  try {
    const vehicle = await invModel.getVehicleById(inventoryId);
    if (vehicle) {
     // console.log(vehicle); // Log vehicle data to verify
      res.render("inventory/vehicleDetail", {
        title: `${vehicle.inv_make} ${vehicle.inv_model}`,
        vehicle: vehicle,
        nav,
      });
    } else {
      res.status(404).send("Vehicle not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}

// Controller function to get a specific vehicle by ID
exports.getVehicleById = async (req, res, next) => {
  try {
    const vehicleId = req.params.id;
    const vehicle = await inventoryModel.getVehicleById(vehicleId);
    const vehicleHtml = Util.createVehicleHtml(vehicle);
    res.render('inventory/vehicleDetail', {
       vehicleHtml, title: `${vehicle.make} ${vehicle.model}` });
  } catch (error) {
    next(error);
  }
};



invController.buildManagement = async (req, res) => {
    let nav = await Util.getNav();
    res.render('inventory/management', {
        title: 'Inventory Management',
        nav,
    });
};



/* ****************************************
*  Deliver Add Classification View
* *************************************** */
invController.buildAddClassification = async (req, res) => {
  let nav = await Util.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null 
  });
};

/* ****************************************
*  Process Add Classification
* *************************************** */
invController.addClassification = async (req, res) => {
  const { classification_name } = req.body;
  try {
    const result = await invModel.addClassification(classification_name);
    if (result) {
      req.flash("success", "Classification added successfully.");
      res.redirect("/inventory");
    } else {
      req.flash("error", "Failed to add classification.");
      res.redirect("/inventory/add-classification");
    }
  } catch (error) {
    let nav = await Util.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: [{ msg: error.message }], // Pass error messages
      classification_name: req.body.classification_name,
    
    
    });
  }
};



/* ****************************************
*  Deliver Add Inventory View
* *************************************** */
invController.buildAddInventory = async (req, res) => {
  let nav = await Util.getNav();
  let classificationList = await Util.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
    messages: req.flash('success') || req.flash('error')
     
  });
};

/* ****************************************
*  Process Add Inventory
* *************************************** */
invController.addInventory = async (req, res) => {
  const { classification_id, inv_make, inv_model, inv_description, inv_price, inv_image, inv_thumbnail, inv_miles, inv_color } = req.body;

  try {
    const result = await invModel.addInventory({ classification_id, inv_make, inv_model, inv_description, inv_price, inv_image, inv_thumbnail, inv_miles, inv_color });
    if (result) {
      req.flash("success", "Inventory item added successfully.");
      res.redirect("/inventory");
    } else {
      req.flash("error", "Failed to add inventory item.");
      res.redirect("/inventory/add-inventory");
    }
  } catch (error) {
    let nav = await Util.getNav();
    let classificationList = await Util.buildClassificationList(classification_id);
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: [{ msg: error.message }],
      messages: req.flash('success') || req.flash('error')
    });
  }
};



module.exports =  invController


