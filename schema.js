const Joi = require('joi');

module.exports.listingschema = Joi.object({
listing : Joi.object({
    title : Joi.string().required(),
    description : Joi.string().required(),
    location :Joi.string().required(),
    country : Joi.string().required(),
    price : Joi.number().required().min(0),
}).required()
})
// Validating schema, this is all code from joi taken as refernce for future ofc this is modified 

module.exports.reviewschema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required()
    }).required(),
})

// this file is just made for server side validations and for client side validations we have used some bootstrap classes to validate it