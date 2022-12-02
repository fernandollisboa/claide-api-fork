import joiBase from "joi";
import extension from "@joi/date";

const joi = joiBase.extend(extension);

export const updateProjectAssociationSchema = joi.object({
  projectId: joi.number().integer().required().messages({
    "number.base": "Project Id must be a number",
    "any.required": "Project must have an Id",
  }),
  memberId: joi.number().integer().required().messages({
    "number.base": "Member Id must be a number",
    "any.required": "Member must have an Id",
  }),
  startDate: joi.date().format("DD/MM/YYYY").messages({
    "date.format": "Association start date must be in 'DD/MM/YYYY' format",
  }),
  endDate: joi.date().allow(null).format("DD/MM/YYYY").messages({
    "date.format": "Association end date must be in 'DD/MM/YYYY' format",
  }),
});
