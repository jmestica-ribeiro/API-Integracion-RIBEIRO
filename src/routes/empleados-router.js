const express = require('express')
const router = express.Router()

//Importación de Auth Controller
const empleadosController =  require('../controllers/empleados-controller')
const authenticateVisma = require('../middleware/visma-auth-middleware')
const authenticateFinnegans = require('../middleware/auth-finnegans')
const authenticateMicrosoftAPI = require('../middleware/microsoft-auth-middleware')

//Nuevo o update de colaborador en viewID = 50582 | Middlewares de autenticación en VISMA y Microsoft 
router.post('/nuevoempleado',authenticateVisma, authenticateFinnegans,  empleadosController.nuevoEmpleado)


module.exports = router