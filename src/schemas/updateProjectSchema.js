import joiBase from "joi";
import extension from "@joi/date";

const joi = joiBase.extend(extension);

export const updateProjectSchema = joi.object({
  id: joi.number().integer().required().messages({
    "number.base": "Id deve ser um número",
    "any.required": "Project must have an Id",
  }),
  name: joi.string().messages({
    "string.base": "Nome deve ser em formato de texto",
  }),
  creationDate: joi.date().format("DD/MM/YYYY").messages({
    "date.format": "Data de início do projeto deve ser no formato 'DD/MM/YYYY'",
  }),
  endDate: joi.date().format("DD/MM/YYYY").messages({
    "date.format": "Data de fim do projeto deve ser no formato 'DD/MM/YYYY'",
  }),
  room: joi.string().messages({
    "string.base": "Sala deve ser em formato de texto",
  }),
  building: joi.string().messages({
    "string.base": "Prédio deve ser em formato de texto",
  }),
  embrapii_code: joi.string().allow("").messages({
    "string.base": "Código Embrapii deve ser em formato de texto",
  }),
  financier: joi.string().messages({
    "string.base": "Financiador deve ser em formato de texto",
  }),
});
