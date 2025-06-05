const express = require('express')
const router = new express.Router()
const accController = require('../controllers/accountController')
const utilities = require('../utilities/index')
const regValidate = require('../utilities/account-validation')

// Route to build login view
router.get('/login', utilities.handleErrors(accController.buildLogin))

// Route to build registration view
router.get('/register', utilities.handleErrors(accController.buildRegister))

// Route to register an account
router.post('/register',
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accController.registerAccount))

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accController.accountLogin)
)

// Account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accController.buildManagement))

module.exports = router;