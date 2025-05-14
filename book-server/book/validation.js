const Joi = require("@hapi/joi")

const bookInfoValidation = function(data) {
    const schema = Joi.object({
        title: Joi.string()
            .min(4)
            .required(),
        author: Joi.string().allow(''),
        year: Joi.number().allow(null)
    })

    return schema.validate(data);
}

module.exports.bookInfoValidation = bookInfoValidation