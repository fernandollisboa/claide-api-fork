import joiBase from "joi";
import extension from "@joi/date";

const memberTypes = ["ADMIN", "STUDENT", "SUPPORT", "PROFESSOR", "EXTERNAL"];
const joi = joiBase.extend(extension);

export const createMemberSchema = joi.object({
  name: joi.string().regex(/\w/).required().messages({
    "string.base": "Name should be a string",
    "string.empty": `A name must contain value`,
    "string.pattern.base": "Name should have only letters",
    "any.required": "Member should have a name",
  }),
  email: joi.string().required(),
  birthDate: joi.date().format("DD/MM/YYYY").required().messages({
    "date.format": "Date of birth should be in 'DD/MM/YYYY' format",
  }),
  username: joi.string().trim().required().messages({
    "string.base": "Username should be a string",
    "string.empty": `A username must contain value`,
    "any.required": "Member should have a username",
  }),
  cpf: joi.string().trim().regex(/\d/).required().messages({
    "string.base": "Cpf should be a string",
    "string.empty": `A cpf must contain value`,
    "regex.base": "A cpf should have only digits",
    "any.required": "Member should have a cpf",
  }),
  rg: joi.string().trim().regex(/\d/).required().messages({
    "string.base": "Rg should be a string",
    "string.empty": `A rg must contain value`,
    "regex.base": "A rg should have only digits",
    "any.required": "Member should have a rg",
  }),
  passport: joi.string().trim().required().messages({
    "string.base": "Passport should be a string",
    "string.empty": `A passport must contain value`,
    "any.required": "Member should have a passport",
  }),
  phone: joi.string().regex(/\d/).required().messages({
    "string.base": "phone should be a string",
    "string.empty": `A phone must contain value`,
    "regex.base": "A phone should have only digits",
    "any.required": "Member should have a phone",
  }),
  lsdEmail: joi.string().trim().required().messages({
    "string.base": "Lsd Email should be a string",
    "string.empty": `A lsd Email must contain value`,
    "any.required": "Member should have a lsd Email",
  }),
  secondaryEmail: joi.string().allow("").messages({
    "string.base": "Secondary Email should be a string",
  }),
  memberType: joi.string().required(),
  lattes: joi.string().trim().required().messages({
    "string.base": "Curriculum lattes should be a string",
    "string.empty": `A curriculum lattes must contain value`,
    "any.required": "Member should have a curriculum lattes",
  }),
  roomName: joi.string().messages({
    "string.base": "Room should be a string",
    "string.empty": `A room must contain value`,
    "any.required": "Member should have a room",
  }),
  hasKey: joi.boolean().required().messages({
    "boolean.base": "Information about key should be a boolean",
    "any.required": "Member should have information about key",
  }),
  isActive: joi.boolean().default(true).required().messages({
    "boolean.base": "Information about active should be a string",
    "any.required": "Member should have information about active",
  }),
});

export const updateMemberSchema = joi.object({
  id: joi.number().required().messages({
    "any.required": "To update a member an id must be provided",
  }),
  name: joi.string().allow(""),
  email: joi.string().allow(""),
  birthDate: joi.date().allow("").format("DD/MM/YYYY").messages({
    "date.format": "Date of birth should be in 'DD/MM/YYYY' format",
  }),
  username: joi.string().allow(""),
  cpf: joi.string().allow(""),
  rg: joi.string().allow(""),
  passport: joi.string().allow(""),
  phone: joi.string().allow(""),
  lsdEmail: joi.string().allow(""),
  secondaryEmail: joi.string().allow(""),
  memberType: joi.string().allow(""),
  lattes: joi.string().allow(""),
  roomName: joi.string().allow(""),
  hasKey: joi.boolean().allow(null, ""),
});

export async function validateMemberType(body) {
  const aux = body.memberType;
  if (!memberTypes.includes(aux.toString())) {
    return false;
  }
}
