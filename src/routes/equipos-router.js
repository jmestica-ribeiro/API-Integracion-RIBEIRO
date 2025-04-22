const express = require('express')
const router = express.Router()

//Importación de Auth Controller
const equiposController =  require('../controllers/equipos-controller')
const authenticateFracttal = require('../middleware/auth-fracttal')
const authenticateFinnegans = require('../middleware/auth-finnegans')

//Nuevo o update de colaborador en viewID = 50582 | Middlewares de autenticación en VISMA y Microsoft 
router.post('/equipo',authenticateFinnegans,  authenticateFracttal,  equiposController.nuevoEquipo)


module.exports = router