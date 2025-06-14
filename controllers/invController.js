const invModel = require('../models/inventory-model')
const utilities = require('../utilities')
require("dotenv").config()


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
    //const classificationSelect = await utilities.buildClassificationList()
    res.render('inventory/classification', {
        title: className + ' Vehicles',
        nav,
        grid,
        //classificationSelect
    })
}

/* ***************************
 *  Build inventory by vehicle view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
    const inv_id = req.params.inventoryId
    const data = await invModel.getVehicleByInventoryId(inv_id)
    const details = await utilities.buildVehicleDetails(data)
    let nav = await utilities.getNav()
    const carMakeModel = `${data.inv_make} ${data.inv_model}` 
    res.render('inventory/vehicle', {
        title: carMakeModel,
        nav,
        details
    })
    
}

/* ***************************
 *  Build inventory by vehicle view for error link
 * ************************** */
invCont.buildByInventoryError = async function (req, res, next) {
    const inv_id = req.params
    const data = await invModel.getVehicleByInventoryError(inv_id)
    const details = await utilities.buildVehicleDetails(data)
    //let nav = await utilities.getNav()
    const carMakeModel = `${data.inv_make} ${data.inv_model}` 
    res.render('inventory/vehicle', {
        title: carMakeModel,
        nav,
        details
    })
    
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
    const nav = await utilities.getNav()
    res.render('inventory/management',{
        title: "Vehicle Management",
        nav,
        errors: null
    })
}

/* ****************************************
*  Deliver add classification view
* *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
    const nav = await utilities.getNav()
    res.render('inventory/add-classification', {
        title: "Add New Classification",
        nav,
        errors: null
    })
}

/* ****************************************
*  Process adding classfication
* *************************************** */
invCont.addClassification = async function (req, res) {
    const { classification_name } = req.body
    
    const classResult = await invModel.addClassification(classification_name)

    if (classResult) {
        const nav = await utilities.getNav()
        req.flash('notice', 'The new car classification was added.')
        res.status(201).render('inventory/management', {
            title: 'Vehicle Management',
            nav,
            errors: null
        })
    } else {
        const nav = await utilities.getNav()
        req.flash('notice', 'Adding new car classification failed.')
        req.status(501).render('inventory/add-classification', {
            title: 'Add New Classification',
            nav,
            errors: null
        })
    }
}

/* ****************************************
*  Deliver add inventory view
* *************************************** */
invCont.buildAddInventory = async function (req, res) {
    const nav = await utilities.getNav()
    const classList = await utilities.buildClassList()
    res.render('inventory/add-inventory', {
        title: 'Add New Vehicle',
        nav,
        classList,
        errors: null,
    })
}

/* ****************************************
*  Process adding classfication
* *************************************** */
invCont.addInventory = async function (req, res) {
    const nav = await utilities.getNav()
    const classList = await utilities.buildClassList()
    const { classification_id , inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    const invResult = await invModel.addInventory(
        classification_id, 
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color, )

    if (invResult) {
        req.flash('notice', 'The new vehicle was added in the inventory.')
        res.status(201).render('inventory/management', {
            title: 'Vehicle Management',
            nav,
            errors: null
        })
    } else {
        req.flash('notice', 'Adding new vehicle failed.')
        req.status(501).render('inventory/add-inventory', {
            title: 'Add New Vehicle',
            nav,
            classList,
            errors: null,
        })
    }
}


module.exports = invCont