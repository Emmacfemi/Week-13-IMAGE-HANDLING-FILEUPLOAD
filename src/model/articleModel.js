const mongoose = require("mongoose");

const articleSchema =  new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title:{
            type: String,
            required: true,
            minlength: 5
        }, 

        introduction: {
            type: String,
            required: true,
            minlength: 20,
        },

        body: {
            type: String,
            required: true,
            minlength: 50,
        },

        conclusion: {
            type: String,
            required: true,
            minlength: 30,
            maxlength: 100,
        },

        images: {
            type: [String],
            default: [],
            validate: [
                (val) => val.length <= 5,
                `An article cannot have more than 5 images`
            ]
        }
        
    },
    
    { 
        timestamps: true
    }
);

const modelArticle = mongoose.model("Article", articleSchema);

module.exports = modelArticle;