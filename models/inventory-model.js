const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get classification name by Classification ID
 * ************************** */
async function getClassName(classification_id){
  const className = await pool.query("SELECT classification_name FROM public.classification WHERE classification_id = $1", [classification_id])
  return className.rows
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
    console.error('getclassificationbyid error ' + error)
  }
}

/* ***************************
 *  Get all inventory items by inv_id
 * ************************** */
async function getVehicleByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error('getinventorybyid error ' + error)
  }
}

/* ***************************
 *  Get all inventory item with error
 * ************************** */
async function getVehicleByInventoryError(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`,
      [inv_id]
    )
    return data
  } catch (error) {
    console.error('getinventorybyid error ' + error)
  }
}

/* ***************************
 *  Adding a new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = 'INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *'
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Check for existing classfication name
 * ************************** */
async function checkExistingClassName(classification_name) {
  try {
    const sql = `SELECT * FROM classification WHERE classification_name = $1`
    const className = await pool.query(sql, [classification_name])
    return className.rowCount
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Adding new vehicle in inventory
 * ************************** */
async function addInventory(classification_id , inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) {
  try {
    const sql = `INSERT INTO public.inventory (classification_id , inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
    return await pool.query(sql, [classification_id , inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Edit new vehicle in inventory
 * ************************** */
async function editInventory(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    const sql = `UPDATE public.inventory SET inv_make= $1, inv_model= $2, inv_year= $3, inv_description= $4, inv_image= $5, inv_thumbnail= $6, inv_price= $7, inv_miles= $8, inv_color= $9, classification_id= $10 WHERE inv_id= $11 RETURNING *`
    const data = await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id])
    return data.rows[0]
  } catch (error) {
    console.error('model error: ' + error)
  }
}

module.exports = {getClassifications, getClassName, getInventoryByClassificationId , getVehicleByInventoryId, getVehicleByInventoryError, addClassification, checkExistingClassName, addInventory, editInventory}