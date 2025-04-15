const express = require('express')
const routerAPI = require('./routes/index')

//Initializing
require('dotenv').config();
const app = express()
const PORT = process.env.PORT || 3000

//Middleware
app.use(express.json())

//Routing api request
app.use("/api", routerAPI)

app.listen(PORT, () => {console.log(`Server listening on ${PORT}`)})