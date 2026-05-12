const express = require('express')
const cors = require ('cors')
const  UserRoutes = require ('/routers/UsersRouters')
const PetRoutes = require (',/routers/PetRoutes')

const app = express ()

app. use (express.json ())

 app. use (cprs ({ credentials: true, origin: 'http://localhost:3000'}))

 app.use(express.static('public'))

 app.use ('/users' , UserRouters)
 app.use('/pets', PetRoutes)

 app.listen(5000)