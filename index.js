const express = require('express');
const app = express()
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express')
const yamljs = require('yamljs')
const {processTransactions} = require("./middlewares");
const swaggerDocument = yamljs.load('docs/swagger.yaml')
require('dotenv').config()

// Serve API documentation on /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Parse request body as JSON into req.body
app.use(express.json())

// Endpoints
app.use('/users', require('./routes/users'))
app.use('/sessions', require('./routes/sessions'))
app.use('/transactions', require('./routes/transactions'))

mongoose.connect(process.env.MONGODB_URI, {}, function () {
    console.log('Connected to mongoDB')
})
processTransactions()

app.listen(process.env.PORT, function () {
    console.log(`Listening on port ${process.env.PORT}`)
})