const invModel = require("../models/inv_model");
const Util = require("../utilities/");

const invController = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invController.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  try {
    const data = await invModel.getInventoryByClassificationId(classification_id);
    if (data.length === 0) {
      req.flash("error", "No inventory items found for this classification.");
      return res.redirect("/inventory");
    }
    const grid = await Util.buildClassificationGrid(data);
    let nav = await Util.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred while fetching inventory.");
    res.redirect("/inventory");
  }
};

invController.buildByInventoryId = async function (req, res) {
  const inventoryId = req.params.inventoryId;
  let nav = await Util.getNav();
  try {
    const vehicle = await invModel.getVehicleById(inventoryId);
    if (vehicle) {
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
};

// Controller function to get a specific vehicle by ID
invController.getVehicleById = async (req, res, next) => {
  try {
    const vehicleId = req.params.id;
    const vehicle = await invModel.getVehicleById(vehicleId);
    const vehicleHtml = Util.createVehicleHtml(vehicle);
    res.render('inventory/vehicleDetail', {
      vehicleHtml, title: `${vehicle.make} ${vehicle.model}`
    });
  } catch (error) {
    next(error);
  }
};

invController.buildManagement = async (req, res) => {
  let nav = await Util.getNav();
  const classificationSelect = await Util.buildClassificationList()
  res.render('inventory/management', {
    title: 'Inventory Management',
    nav,
    messages: req.flash('success') || req.flash('error'),
    classificationSelect,
  });
};

 invController.buildManagementView = async function (req, res, next){
  let nav = await Util.getNav()
  const classificationSelect = await Util.buildClassificationList()
  res.render("./inventory/management", {
    title: 'Inventory Management',
    nav,
    errors: null,
    classificationSelect,
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
      classification_name: req.body.classification_name
    });
  }
};

/* ****************************************
 *  Deliver Add Inventory View
 * *************************************** */
invController.buildAddInventory = async (req, res) => {
  let nav = await Util.getNav();
  let classificationList = await Util.buildClassificationList();
  let viewAddInv = await Util.buildAddInventoryView();
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    viewAddInv,
    errors: req.flash('error') || null,
    messages: req.flash('success') || req.flash('error'),
    classificationList,
    errors: null,
  });
};

/* ****************************************
 *  Process Add Inventory
 * *************************************** */
invController.addInventory = async (req, res) => {
  const { classification_id, inv_make, inv_model, inv_description, inv_price,inv_year, inv_image, inv_thumbnail, inv_miles, inv_color } = req.body;
  try {
    const result = await invModel.addInventory({ classification_id, inv_make, inv_model, inv_description, inv_price, inv_year, inv_image, inv_thumbnail, inv_miles, inv_color });
    if (result) {
      req.flash("success", "Inventory item added successfully.");
      res.redirect("/inv");
    } else {
      req.flash("error", "Failed to add inventory item.");
      res.redirect("/inv/add-inventory");
    }
  } catch (error) {
    let nav = await Util.getNav();
    let classificationList = await Util.buildClassificationList(classification_id);
    let viewAddInv = await Util.buildAddInventoryView();
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      viewAddInv,
      errors: [{ msg: error.message }],
      messages: req.flash('success') || req.flash('error')
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invController.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ****************************************
 *  Build Edit Inventory View
 * *************************************** */
invController.buildEditInventory = async (req, res) => {
  const inventory_id = req.params.inventory_id;
  let nav = await utilities.getNav();
  let inventoryItem = await invModel.getInventoryById(inventory_id);
  if (!inventoryItem) {
      req.flash("error", "Inventory item not found.");
      return res.redirect("/inventory");
  }
  res.render("inventory/edit-inventory", {
      title: `Edit ${inventoryItem.inv_make} ${inventoryItem.inv_model}`,
      nav,
      inventoryItem,
      errors: null,
      messages: req.flash('success') || req.flash('error')
  });
};


/* ***************************
 *  Build edit inventory view
 * ************************** */
invController.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

module.exports = invController
