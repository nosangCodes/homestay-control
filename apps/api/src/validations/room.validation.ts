import Joi, { number } from "joi";

const create = {
  body: Joi.object().keys({
    title: Joi.string().min(1).max(50).required(),
    description: Joi.string().min(50).max(250).required(),
    rate: Joi.number().min(100).required(),
    underMaintenance: Joi.boolean().default(false),
    facilities: Joi.array()
      .items(
        Joi.object().keys({
          id: Joi.number().required(),
        })
      )
      .min(1)
      .required(),
  }),
};

export { create };
