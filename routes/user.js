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
            password: hashedPassword
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
      return res.status(400).send('Cannot find user')
    }
    try {
      if(await bcrypt.compare(req.body.password, user.password)) {
        const userName = {
            name: req.body.username
        }
        const accessToken = jwt.sign(userName, process.env.ACCESS_TOKEN_SECRET)
        console.log(accessToken)
        res.status(200).json({
            accessToken: accessToken
        })
      } else {
        res.status(401).send('Wrong Password')
      }
    } catch (err) {
      console.log(err)
      res.status(500).send()
    }
  })


module.exports = router