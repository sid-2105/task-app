const express = require('express')
require('./db/mongoose')
const userrouter = require('./routers/user')
const taskrouter = require('./routers/task')
const jwt = require ('jsonwebtoken')
const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userrouter)
app.use(taskrouter)

module.exports = app

