const joi = require("joi");

const postValidation = joi.object({
    title: joi.string().min(5).max(100),
    introduction: joi.string().min(20).max(150),
    body: joi.string().min(50).max(500),
    conclusion: joi.string().min(20).max(100),
    author: joi.string().optional().default("Emmac"),
});

const validatePost = (req, res, next) => {
    console.log(req.body);

    const { error, value } = postValidation.validate(req.body);

    if(error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    req.body = value;

    next();

}


const updateValidation = joi.object({
    title: joi.string().min(5).max(100),
    introduction: joi.string().min(10).max(150),
    body: joi.string().min(50).max(500),
    conclusion: joi.string().min(20).max(100),
    author: joi.string().optional().default("Guest"),
});

const validateUpdate = (req, res, next) => {
    const { error, value } = updateValidation.validate(req.body);
    
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    next();

}

module.exports = {
    validatePost,
    validateUpdate
}
