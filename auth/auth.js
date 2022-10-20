const express = require('express')
const jwt = require('jsonwebtoken')
const { ROLE } = require("../const/userRole");

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    console.log(token);
    if (token === null || token === undefined) {
        return res.status(401).send("Access Token missing")
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(401)
        }
        req.user = user
        next()
    })
}

function verifyAdmin(req, res, next) {
    const role = req.user.role
    const admins = [ROLE.ADMIN]
    if (!admins.includes(role)) {
        return res.sendStatus(403)
    }
    next();
}

module.exports = { authenticateToken, verifyAdmin } 