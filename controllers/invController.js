const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

exports.buildVehicleDetailView = async (req, res) => {
  const inventoryId = req.params.inventoryId;
  try {
    const vehicle = await invModel.getVehicleById(inventoryId);
    if (vehicle) {
      console.log(vehicle); // Log vehicle data to verify
      res.render("inventory/vehicleDetail", {
        title: `${vehicle.inv_make} ${vehicle.inv_model}`,
        vehicle: vehicle
      });
    } else {
      res.status(404).send("Vehicle not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};



module.exports = invCont