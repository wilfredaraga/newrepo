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
    const className = await invModel.getClassName(classification_id)
    res.render('inventory/classification', {
        title: className[0].classification_name + ' Vehicles',
        nav,
        grid,
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
    const classificationSelect = await utilities.buildClassList()
    res.render('inventory/management',{
        title: "Vehicle Management",
        nav,
        classificationSelect,
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
        res.status(501).render('inventory/add-classification', {
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
*  Process adding inventory
* *************************************** */
invCont.addInventory = async function (req, res) {
    const nav = await utilities.getNav()
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
        const classList = await utilities.buildClassList(classification_id)
        req.flash('notice', 'Adding new vehicle failed.')
        res.status(501).render('inventory/add-inventory', {
            title: 'Add New Vehicle',
            nav,
            classList,
            errors: null,
            classification_id, 
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
        })
    }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async(req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id){
        return res.json(invData)
    } else {
        next(new Error('No data returned'))
    }
}

/* ***************************
 *  Edit Item in the inventory View
 * ************************** */
invCont.buildEditVehicle = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    const nav = await utilities.getNav()
    const vehicleData = await invModel.getVehicleByInventoryId(inv_id)
    const classList = await utilities.buildClassList(vehicleData.classification_id)
    const vehicleName = `${vehicleData.inv_make} ${vehicleData.inv_model}`
    res.render('inventory/edit-inventory', {
        title: 'Edit ' + vehicleName,
        nav,
        classList,
        errors: null,
        inv_id: vehicleData.inv_id,
        inv_make: vehicleData.inv_make,
        inv_model: vehicleData.inv_model,
        inv_year: vehicleData.inv_year,
        inv_description: vehicleData.inv_description,
        inv_image: vehicleData.inv_image,
        inv_thumbnail: vehicleData.inv_thumbnail,
        inv_price: vehicleData.inv_price,
        inv_miles: vehicleData.inv_miles,
        inv_color: vehicleData.inv_color,
        classification_id: vehicleData.classification_id
    })
}

/* ****************************************
*  Process editing inventory
* *************************************** */
invCont.editInventory = async function (req, res) {
    const nav = await utilities.getNav()
    const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    const updateResult = await invModel.editInventory(
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id, )

    if (updateResult) {
        const vehicleName = `${updateResult.inv_make} ${updateResult.inv_model}`
        req.flash('notice', `The ${vehicleName} was successfully updated.`)
        res.redirect('/inv/')
    } else {
        const classList = await utilities.buildClassList(classification_id)
        const vehicleName = `${inv_make} ${updateResult.inv_model}`
        req.flash('notice', 'Sorry, the insert failed.')
        res.status(501).render('inventory/edit-inventory', {
            title: 'Edit ' + vehicleName,
            nav,
            classList:classList,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
        })
    }
}

module.exports = invCont