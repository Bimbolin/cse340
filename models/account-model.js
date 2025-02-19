const pool = require("../database/index");
const db = require('../database');


/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

  /* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}


/* ***************************
 *  Get Account by ID
 * ************************** */
const getAccountById = async (account_id) => {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email FROM account WHERE account_id = $1",
      [account_id]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Database error:", err);
    return null;
  }
};


/* ***************************
 *  Update Account
 * ************************** */
const updateAccount = async (account_id, account_firstname, account_lastname, account_email) => {
  try {
    const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4";
    await pool.query(sql, [account_firstname, account_lastname, account_email, account_id]);
    return true; // Indicate success
  } catch (error) {
    console.error("Error updating account:", error);
    return false; // Indicate failure
  }
};

/* ***************************
 *  Update Password
 * ************************** */
const updatePassword = async (account_id, hashedPassword) => {
  try {
    const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2";
    await pool.query(sql, [hashedPassword, account_id]);
    return true; // Indicate success
  } catch (error) {
    console.error("Error updating password:", error);
    return false; // Indicate failure
  }
};

/* ***************************
 *  Log User Activity
 * ************************** */
const logActivity = async (user_id, activity_type) => {
  try {
    await db.none("INSERT INTO user_activity_log (user_id, activity_type) VALUES ($1, $2)", [user_id, activity_type]);
  } catch (err) {
    console.error("Error logging activity:", err);
  }
};

/* ***************************
 *  Get User Activity Log
 * ************************** */
const getActivityLogByUserId = async (user_id) => {
  try {
    const result = await db.any("SELECT * FROM user_activity_log WHERE user_id = $1 ORDER BY activity_timestamp DESC", [user_id]);
    return result;
  } catch (err) {
    console.error("Error fetching activity log:", err);
    return [];
  }
};



  module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccount, updatePassword, logActivity, getActivityLogByUserId  };
