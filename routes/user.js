const express = require('express')
const router = express.Router()
const User = require('../models/user')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('dotenv').config()
const jwt = require('jsonwebtoken')

router.post('/user', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = new User({
            username: req.body.username,
            password: hashedPassword,
            role: req.body.role
        })
        const newUser = await user.save();
        res.status(201).json(newUser)
    } catch (err) {
        console.log(err);
        res.status(500).send()
    }
})

router.post('/user/login', async (req, res) => {
    const user = await User.findOne({
        username: req.body.username
    })
    if (user == null) {
      return res.status(404).send({
        authenticated: false,
        token: null,
        message: "Invalid Username"
    })
    }
    try {
      if(await bcrypt.compare(req.body.password, user.password)) {
        const accessToken = jwt.sign(
            {
                user: user.username,
                role: user.role
            }, 
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: "24h"})
        console.log(accessToken)
        res.status(200).json({
            authenticated: true,
            message: "Login success",
            accessToken: accessToken
        })
      } else {
        res.status(401).send({
            authenticated: false,
            message: "Login failed",
            accessToken: null
        })
      }
    } catch (err) {
      console.log(err)
      res.status(500).send()
    }
  })


module.exports = router