const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken");
const crypto = require('crypto')
//User Database
const UserDB = require('../models/userModel')

//Middleware
const CheckAuth = require('../CheckAuth')

router.get('/', (req, res, next)=>{
    res.status(200).json({
        Message: "Welcome To API"
    })
})

router.post('/login', (req, res, next)=>{
    UserDB.find({email: req.body.email})
    .exec()
    .then(result => {
        if(!result.length < 1){
            hashPassword = crypto.createHmac("sha256", "G-KaPdSgVkYp3s6v9y$B&E(H+MbQeThW").update(req.body.password).digest("hex")
            console.log(hashPassword)
            if(hashPassword == result[0].password){
                const jwtTOken = jwt.sign({
                    _id:result[0]._id,
                    email: result[0].email,
                    username: result[0].username
                },
                "This%ASDADSECretIkEy",
                {
                    expiresIn: "1h"
                })
                res.status(200).json({
                    Message: "Login",
                    Data: result,
                    Token: jwtTOken
                })
            }else{
                res.status(401).json({
                    Message: "Wrong Password"
                })
            }
        }else{
            res.status(401).json({
                Message: "Wrong email"
            })
        }
    })
})

router.post('/priv', CheckAuth, (req, res, next)=>{
    const userID = req.body._id
    UserDB.remove({_id:userID})
    .exec()
    .then(result =>{
        res.status(200).json({
            Message: "User Deleted",
            _id: userID
        })
    })
    .catch(err =>{
        res.status(401).json({
            Message: err
        })
    })
})

router.get('/csdata/:userId', CheckAuth, (req, res, next)=>{
    const userId = req.params.userId
    UserDB.find({_id:userId})
    .exec()
    .then(result =>{
        res.status(200).json({
            Message: "User Data",
            Data: [{
                _id:result[0]._id,
                username:result[0].username,
                email:result[0].email,
                usercreated: Date(result[0].usercreated)
            }]
        })
    })
    .catch(err =>{
        res.status(401).json({
            Message: "User Not Found"
        })
    })
})

router.get('/alluser', (req, res, next) =>{
    UserDB.find()
    .exec()
    .then(result =>{
        res.status(200).json({
            Message: "User Database",
            Total: result.length,
            Data: result
        })
    })
    .catch(err =>{
        res.status(401).json({
            Message: err
        })
    })
})

router.post('/signup', (req, res, next)=>{
    UserDB.find({email: req.body.email})
    .exec()
    .then(result =>{
        if(result > 1){
            res.status(401).json({
                Message: "Username Or Email Already Existed"
            })
            console.log(result)
        }
        else{
            hashPassword = crypto.createHmac("sha256", "G-KaPdSgVkYp3s6v9y$B&E(H+MbQeThW").update(req.body.password).digest("hex")
            const userNew = new UserDB({
                email: req.body.email,
                username: req.body.username,
                name: req.body.name,
                usercreated: Date.now(),
                password: hashPassword
            })
            userNew.save()
            .then(result =>{
                res.status(200).json({
                    Message: "User Created",
                    Data: result
                })
                console.log(result)
            })
            .catch(err =>{
                res.status(501).json({
                    Message: "Error"
                })
            })
        }

    })
})




module.exports = router