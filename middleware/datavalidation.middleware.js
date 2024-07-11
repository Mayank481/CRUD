const Joi = require("joi");
const logger = require("../logger/logger");

const registerschema = Joi.object({
  firstName: Joi.string().alphanum().min(3).max(30).required(),
  lastName: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  phoneNumber: Joi.number()
    .integer()
    .min(1000000000)
    .max(9999999999)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be a valid 10-digit number",
    })
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

const updateUserSchema = Joi.object({
  firstName: Joi.string().alphanum().min(3).max(30),
  lastName: Joi.string().alphanum().min(3).max(30),
  email: Joi.string().email(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  phoneNumber: Joi.number().integer().min(1000000000).max(9999999999).messages({
    "string.pattern.base": "Phone number must be a valid 10-digit number",
  }),
});

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      logger.error(error);
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};

module.exports = {
  validateRegister: validateRequest(registerschema),
  validateLogin: validateRequest(loginSchema),
  validateUpdate: validateRequest(updateUserSchema),
};
