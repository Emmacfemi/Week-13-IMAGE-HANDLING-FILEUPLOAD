const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
            minlength: 4,            
        },

        username: {
            type: String,
            required: true,
            unique: true,
            minlength: 7,            
        },

        email:  {
            type: String,
            required: true,            
            unique: true,
            lowercase: true,
            trim: true,
        },

        password:  {
            type: String,
            required: true,
            minlength: 10,           
        },

        avatar: {
            type: String,
            default: '',
        }

    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("User", userSchema)