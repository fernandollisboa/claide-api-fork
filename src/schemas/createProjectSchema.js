import joiBase from "joi";
import extension from "@joi/date";

const joi = joiBase.extend(extension);

export const createProjectSchema = joi.object({
  name: joi.string().required().messages({
    "string.base": "Nome deve ser em formato de texto",
    "any.required": "Projeto deve ter um nome",
  }),
  creationDate: joi.date().format("DD/MM/YYYY").required().messages({
    "date.format": "Data de início do projeto deve ser no formato 'DD/MM/YYYY'",
    "any.required": "Projeto deve ter uma data de início",
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
  embrapii_code: joi.string().messages({
    "string.base": "Código Embrapii deve ser em formato de texto",
  }),
  financier: joi.string().messages({
    "string.base": "Financiador deve ser em formato de texto",
  }),
});
