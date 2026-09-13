const joi = require("joi");


const registerValidation = (req, res, next) => {
    const registerSchema = joi.object({
        fullname: joi.string().min(10).required(),
        username: joi.string().min(5).required(),
        email: joi.string().email().required(),
        password: joi.string().min(10).required()
    });

    const { error, value } = registerSchema.validate(req.body, {
        abortEarly: false
    });

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    req.body = value;

    next();

}

const loginValidation = (req, res, next) => {
    const loginSchema = joi.object({
        fullname: joi.string().min(10),
        username: joi.string().min(5),
        email: joi.string().email().required(),
        password: joi.string().min(10).required()
    });

    const { error, value } = loginSchema.validate(req.body, {
        abortEarly: false
    });

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    req.body = value;

    next();

}

module.exports = {
    registerValidation,
    loginValidation
}