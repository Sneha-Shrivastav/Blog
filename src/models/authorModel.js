const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        enum: ["Mr", "Mrs", "Miss"]
    },
    email: {
        type: String,

        unique: true,
        required: true,
        validate: {
            validator: function (email) {
                return /^[a-zA-Z0-9+_.-]+@[a-zA-Z.-]+$/.test(email)
            },
            message: "enter valid email address",

        }

    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('author', authorSchema) 
