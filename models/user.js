const mongoose = require('mongoose')
const { ROLE } = require("../const/userRole");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ROLE,
        default: ROLE.USER
    }
})

module.exports = mongoose.model('users', userSchema)