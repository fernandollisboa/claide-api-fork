import Joi from "joi";

export const loginSchema = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
});
