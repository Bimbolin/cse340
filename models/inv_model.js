const pool = require("../database/index");
const db = require('../database');
const invModel = {}; // Make sure invModel is properly defined


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



/* ****************************************
 *  Add New Classification
 * *************************************** */
async function addClassification(classification_name) {
  try {
      const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING classification_id";
      const result = await pool.query(sql, [classification_name]);
      return result.rows[0].classification_id;
  } catch (error) {
      console.error("Error executing query", error);
      throw new Error(error.message);
  }
}

/* ****************************************
*  Add New Inventory Item
* *************************************** */
async function addInventory({ classification_id, inv_make, inv_model, inv_description, inv_price, inv_year, inv_image, inv_thumbnail, inv_miles, inv_color }) {
  try {
      const sql = "INSERT INTO inventory (classification_id, inv_make, inv_model, inv_description, inv_price, inv_year, inv_image, inv_thumbnail, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
      const result = await pool.query(sql, [classification_id, inv_make, inv_model, inv_description, inv_price, inv_year, inv_image, inv_thumbnail, inv_miles, inv_color]);
      return result.rows[0];
  } catch (error) {
      console.error(error);
      throw error;
  }
}


module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addInventory};

