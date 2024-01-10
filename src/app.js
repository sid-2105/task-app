const express = require('express')
const connectToDatebase = require('./db/mongoose')
const userrouter = require('./routers/user')
const taskrouter = require('./routers/task')

const app = express()
const path = require('path')
require('dotenv').config({path:'../config/dev.env'})

connectToDatebase();
const publicDirectory = path.join(__dirname,'../public')

app.use(express.static(publicDirectory))
app.use(express.json())
app.use(userrouter)
app.use(taskrouter)


module.exports = app

