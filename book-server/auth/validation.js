const Joi = require("@hapi/joi")

const registerValidation = function(data) {
    const schema = Joi.object({
        name: Joi.string()
            .min(4)
            .required(),
        email: Joi.string()
            .email()
            .min(6)
            .required(),
        password: Joi.string()
            .min(6)
            .required(),
    })

    return schema.validate(data)
}

const loginValidation = function(data) {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .min(6)
            .required(),
        password: Joi.string()
            .min(6)
            .required(),
    })

    return schema.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation