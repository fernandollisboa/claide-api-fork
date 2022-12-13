import joiBase from "joi";
import extension from "@joi/date";

const joi = joiBase.extend(extension);

export const createServiceSchema = joi.object({
  name: joi.string().required().messages({
    "string.base": "Name should be a string",
    "any.required": "Member should have a name",
  }),
});

export const updateServiceSchema = joi.object({
  name: joi.string().allow("").messages({
    "string.base": "Name should be a string",
  }),
});

export const createServiceAssociationSchema = joi.object({
  serviceId: joi.number().required().messages({
    "number.base": "Service id must be a number",
    "number.empty": "A Service id must contain a valid value",
    "any.required": "Service's association must have the id of the service",
  }),
  memberId: joi.number().required().messages({
    "number.base": "Member Id should be a number",
    "number.empty": "A Member Id must contain value",
    "any.required": "Service's association must have an Member Id",
  }),
});
