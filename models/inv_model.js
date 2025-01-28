const pool = require("../database")
const db = require('../database');

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}


async function getVehicleById(inventoryId) {
  try {
    const result = await pool.query("SELECT * FROM inventory WHERE inv_id = $1", [inventoryId]);
    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Function to retrieve a specific vehicle by ID
exports.getVehicleById = async (vehicleId) => {
  const query = 'SELECT * FROM inventory WHERE id = $1';
  const values = [vehicleId];
  const result = await db.query(query, values);
  return result.rows[0];
};



module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById};