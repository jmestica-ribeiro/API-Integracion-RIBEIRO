const express = require('express')
const router = express.Router()

//Routers
const authRouter = require('./auth-router')
const empleadosRouter = require('./empleados-router')
const equiposRouter = require('./equipos-router')
const authenticateToken = require('../middleware/auth-middleware')


//Auth
router.use('/auth', authRouter)

//Empleados --- con autenticación vía JWT
router.use('/empleados', authenticateToken , empleadosRouter)

//Equipos --- con autenticación vía JWT
router.use('/equipos', authenticateToken, equiposRouter)

//Almacen --- con autenticación vía JWT
// router.use('/ceco', cecoRouter)


module.exports = router