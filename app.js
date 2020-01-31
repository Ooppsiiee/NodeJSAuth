const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')


const userRoutes = require('./api/routes/user')

mongoose.connect("mongodb://username:password@127.0.0.1:27017/?authSource=admin&gssapiServiceName=mongodb")
.then(result =>{
    console.log("Connected To MongoDB")
})
.catch(err =>{
    console.log("Failed To Connect  To MongoDB")
})


app.use(morgan('dev'))
app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });

app.use('/user', userRoutes)


module.exports = app