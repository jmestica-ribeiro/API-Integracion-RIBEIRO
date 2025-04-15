const express = require('express')
const router = express.Router()

//Importación de Auth Controller
const authController =  require('../controllers/auth-controller')

//Login con JSON WEB TOKEN
router.post('/login', authController.login)
router.post('/verify', authController.verify)

module.exports = router