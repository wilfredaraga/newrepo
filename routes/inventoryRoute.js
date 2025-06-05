// Needed Resources
const express = require('express')
const router = new express.Router()
const invController = require('../controllers/invController')
const utilities = require('../utilities/index')

// Route to build inventory by classification view
router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by car view
router.get('/detail/:inventoryId', utilities.handleErrors(invController.buildByInventoryId));

// Route to build management inventory view
router.get('/manCla', utilities.handleErrors(invController.buildClassifiManagementView))
router.get('/manInv', utilities.handleErrors(invController.buildInventManagementView))

router.get('/delete/:inventoryId', utilities.handleErrors(invController.deleteInventoryView));
router.post('/delete/:inventoryId', utilities.handleErrors(invController.deleteInventoryItem))

module.exports = router;