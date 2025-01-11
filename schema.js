const Joi = require("joi");

module.exports.MenuSchema = Joi.object({
  menu: Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number().positive().required(),
    availability: Joi.boolean().default(false),
    image: Joi.string().allow(" ", null),
  }).required(),
});

module.exports.OrderSchema = Joi.object({
  order: Joi.object({
    userId: Joi.string().hex().length(24).required(),
    items: Joi.array()
      .items(
        Joi.object({
          menuItem: Joi.string().hex().length(24).required(),
          quantity: Joi.number().integer().positive().required(),
        })
      )
      .min(1)
      .required(),
  }).required(),
});
