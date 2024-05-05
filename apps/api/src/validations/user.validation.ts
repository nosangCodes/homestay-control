import Joi from "joi";

const signupSchema = {
  body: Joi.object().keys({
    firstName: Joi.string().min(1).max(50).required(),
    lastName: Joi.string().min(1).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    password: Joi.string().min(1).max(50).required(),
  }),
};

export { signupSchema };
