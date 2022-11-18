import joiBase from "joi";
import extension from "@joi/date";

const joi = joiBase.extend(extension);

export const createProjectSchema = joi.object({
  name: joi.string().required().messages({
    "string.base": "Name must be in text format",
    "any.required": "Project must have a name",
  }),
  creationDate: joi.date().format("DD/MM/YYYY").required().messages({
    "date.format": "Project start date must be in 'DD/MM/YYYY' format",
    "any.required": "Project must have a start date",
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
