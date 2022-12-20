import joiBase from "joi";
import extension from "@joi/date";

const joi = joiBase.extend(extension);

export const createServiceSchema = joi.object({
  name: joi.string().trim().required().messages({
    "string.pattern.base": `"name" must be a string`,
  }),
});

export const updateServiceSchema = joi.object({
  name: joi.string().allow("").messages({
    "string.pattern.base": `"name" must be a string`,
  }),
});

export const createServiceAssociationSchema = joi.object({
  memberId: joi.number().required().messages({
    "number.pattern.base": "Member Id should be a number",
  }),
});

export const updateServiceAssociationSchema = joi.object({});
