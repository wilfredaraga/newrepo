const invModel = require('../models/inventory-model')
const utilities = require('../utilities')

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
    res.render('./inventory/classification', {
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
    res.render('./inventory/vehicle', {
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
    res.render('./inventory/vehicle', {
        title: carMakeModel,
        nav,
        details
    })
    
}

module.exports = invCont