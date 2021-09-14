const express = require('express');
const app = express()
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express')
const yamljs = require('yamljs')
const swaggerDocument = yamljs.load('docs/swagger.yaml')

require('dotenv').config()

// Serve API documentation on /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Parse request body as JSON into req.body
app.use(express.json())


// /users endpoints
app.use('/users', require('./routes/users'))

mongoose.connect(process.env.MONGODB_URI, {}, function () {
    console.log('Connected to mongoDB')
})

app.listen(process.env.PORT, function () {
    console.log(`Listening on port ${process.env.PORT}`)
})