const express = require('express')
const router = express.Router()

//Importación de Auth Controller
const empleadosController =  require('../controllers/empleados-controller')
const authenticateVisma = require('../middleware/visma-auth-middleware')
const authenticateMicrosoftAPI = require('../middleware/microsoft-auth-middleware')

//Alta de colaborador en viewID = 50582 | Middlewares de autenticación en VISMA y Microsoft 
router.post('/nuevoempleado',authenticateVisma,  empleadosController.nuevoEmpleado)

//Modificación y/o asignación de CECO y/o CCT en viewID =  | Middlewares de autenticación en VISMA y Microsoft
router.post('/actualizacioncecoycct', authenticateVisma, authenticateMicrosoftAPI, empleadosController.modificacionCCToCECO)

//Modificación de datos generales del colaborador | Middlewares de autenticación en VISMA y Microsoft
router.post('/actualizaciongenerales', authenticateVisma, authenticateMicrosoftAPI, empleadosController.modificacionInformacionGeneral)


module.exports = router