const { body, validationResult } = require('express-validator')
const utilities = require('.')
const validate = {}
const invModel = require('../models/inventory-model')

/*  **********************************
  *  Classification Name Validation Rules
  * ********************************* */
validate.classificationRules = () => {
    return [
    // classification name is required and must be string
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a classification name.") // on error this message is sent.
      .custom(async (classification_name) => {
        const classNameExist = await invModel.checkExistingClassName(classification_name)
        if (classNameExist) {
          throw new Error("Classification name exists. Please use different name")
        }
      }),

    ]
}

/* ******************************
 * Check data and return errors or continue to adding new classification
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
        const nav = await utilities.getNav()
        res.render('inventory/add-classification', {
            errors,
            title: 'Add New Classficiation',
            nav,
            classification_name
        })
        return
    }
    next()
}

/*  **********************************
  *  Adding Inventory Vehicle Validation Rules
  * ********************************* */
validate.invRules = () => {
  return [
    body('classification_id')
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Please choose a classification."),

    body('inv_make')
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Please provide vehicle make."),

    body('inv_model')
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Please provide vehicle model."),

    body('inv_year')
    .trim()
    .escape()
    .notEmpty()
    .isNumeric()
    .isLength({ min: 3 })
    .withMessage("Please provide vehicle year."),

    body('inv_description')
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage("Please provide description."),

    body('inv_image')
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Please provide image path."),

    body('inv_thumbnail')
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Please provide thumbnail path."),

    body('inv_price')
    .trim()
    .escape()
    .notEmpty()
    .isNumeric()
    .isLength({ min: 1 })
    .withMessage("Please provide vehicle price."),

    body('inv_miles')
    .trim()
    .escape()
    .notEmpty()
    .isNumeric()
    .isLength({ min: 1 })
    .withMessage("Please provide vehicle miles."),

    body('inv_color')
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Please provide vehicle color."),

  ]
}

/* ******************************
 * Check data and return errors or continue to adding new vehicle
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if(!errors.isEmpty()) {
        const nav = await utilities.getNav()
        res.render('inventory/add-inventory', {
            errors,
            title: 'Add New Inventory',
            nav,
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_price,
        })
        return
    }
    next()
}


module.exports = validate