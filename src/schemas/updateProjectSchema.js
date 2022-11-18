import joiBase from "joi";
import extension from "@joi/date";

const joi = joiBase.extend(extension);

export const updateProjectSchema = joi.object({
  id: joi.number().integer().required().messages({
    "number.base": "Id must be a number",
    "any.required": "Project must have an Id",
  }),
  name: joi.string().messages({
    "string.base": "Name must be in text format",
  }),
  creationDate: joi.date().format("DD/MM/YYYY").messages({
    "date.format": "Project start date must be in 'DD/MM/YYYY' format",
  }),
  endDate: joi.date().allow(null).format("DD/MM/YYYY").messages({
    "date.format": "Project end date must be in 'DD/MM/YYYY' format",
  }),
  room: joi.string().allow(null).messages({
    "string.base": "Room must be in text format",
  }),
  building: joi.string().allow(null).messages({
    "string.base": "Building must be in text format",
  }),
  embrapii_code: joi.string().allow(null).messages({
    "string.base": "Embrapii code must be in text format",
  }),
  financier: joi.string().allow(null).messages({
    "string.base": "Financier must be in text format",
  }),
});
