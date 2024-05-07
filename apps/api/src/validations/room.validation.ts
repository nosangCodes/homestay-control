import Joi from "joi";

const create = {
  body: Joi.object().keys({
    title: Joi.string().min(1).max(50).required(),
    description: Joi.string().min(50).max(250).required(),
    rate: Joi.number().min(100).required(),
    underMaintenance: Joi.boolean().default(false),
  }),
};

export { create };
