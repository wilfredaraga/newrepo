// Needed Resources
const express = require('express')
const router = new express.Router()
const invController = require('../controllers/invController')
const utilities = require('../utilities/index')
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by car view
router.get('/detail/:inventoryId', utilities.handleErrors(invController.buildByInventoryId));
// Error route
router.get('/error/20', utilities.handleErrors(invController.buildByInventoryError));

//Route to management view
router.get('/', utilities.handleErrors(invController.buildManagementView))

//Route to add-classification view
router.get('/addClass', utilities.handleErrors(invController.buildAddClassification))
//Route to process adding a new classification
router.post('/addClass',
    invValidate.classificationRules(),
    invValidate.checkClassData,
    utilities.handleErrors(invController.addClassification))

//Route to add-inventory view
router.get('/addInv', utilities.handleErrors(invController.buildAddInventory))
//Route to process adding a new inventory
router.post('/addInv',
    invValidate.invRules(),
    invValidate.checkInvData,
    utilities.handleErrors(invController.addInventory))
    
module.exports = router;