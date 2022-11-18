import joiBase from "joi";
import extension from "@joi/date";

const joi = joiBase.extend(extension);
//TO-DO padronizar mensagens de falha de validação
export const createMemberSchema = joi.object({
  name: joi
    .string()
    .regex(/^([a-zA-Z]{2,}\s[a-zA-Z]{1,}[a-zA-Z]*)/)
    .required()
    .messages({
      "string.base": "Name should be a string",
      "string.empty": `A name must contain value`,
      "string.pattern.base":
        "Name should have only letters, with at least two names (first name and surname)",
      "any.required": "Member should have a name",
    }),
  email: joi.string().required().email(),
  birthDate: joi.date().format("DD/MM/YYYY").required().messages({
    "date.format": "Date of birth should be in 'DD/MM/YYYY' format",
  }),
  username: joi.string().alphanum().min(3).max(20).required().messages({
    "string.base": "Username should be a string",
    "string.min": "Username must have at least 3 characters",
    "string.max": "Username must have at most 20 characters",
    "string.empty": `A username must contain value`,
    "any.required": "Member should have a username",
  }),
  cpf: joi
    .string()
    .allow("")
    .regex(/^[0-9]{11}$/)
    .messages({
      "string.base": "Cpf should be a string",
      "string.pattern.base": "CPF should have only digits, and 11 of them!",
    }),
  rg: joi
    .string()
    .allow("")
    .regex(/^[0-9]{7,10}$/)
    .messages({
      "string.base": "Rg should be a string",
      "string.pattern.base": "A rg should have only digits, and at least 7 of them!",
    }),
  passport: joi
    .string()
    .regex(/^[A-Z]{2}[0-9]{7}/)
    .allow("")
    .messages({
      "string.base": "Passport should be a string",
      "string.pattern.base": "A passport must be in the pattern XX0000000",
    }),
  phone: joi
    .string()
    .regex(/^[0-9]{11,13}$/)
    .required()
    .messages({
      "string.base": "phone should be a string",
      "string.empty": `A phone must contain value`,
      "string.pattern.base": "A phone should have only digits and 11 - 13 of them!",
      "any.required": "Member should have a phone",
    }),
  lsdEmail: joi
    .string()
    .email({ minDomainSegments: 4 })
    .pattern(/^\w+([.-]?\w+)*@(lsd\.ufcg\.edu\.br)/)
    .required()
    .messages({
      "string.base": "Lsd Email should be a string",
      "string.empty": `A lsd Email must contain value`,
      "any.required": "Member should have a lsd Email",
    }),
  secondaryEmail: joi.string().allow("").email().messages({
    "string.base": "Secondary Email should be a string",
  }),
  memberType: joi
    .string()
    .valid("ADMIN", "STUDENT", "SUPPORT", "PROFESSOR", "EXTERNAL")
    .required()
    .messages({
      "any.required": "Member should have a type",
    }),
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
  isActive: joi.boolean().default(false).messages({
    "boolean.base": "Information about activity should a boolean",
  }),
  isBrazilian: joi.boolean().required().messages({
    "boolean.base": "Information about being brazilian should be a boolean",
    "any.required": "Member should have information about if is brazilian or not",
  }),
});

export const updateMemberSchema = joi.object({
  id: joi.number().required().messages({
    "any.required": "To update a member an id must be provided",
  }),
  name: joi
    .string()
    .regex(/^([a-zA-Z]{2,}\s[a-zA-Z])/)
    .allow("")
    .messages({
      "string.pattern.base":
        "Name should have only letters and spaces, with at least a name and a last name",
    }),
  email: joi.string().allow("").email(),
  birthDate: joi.date().allow("").format("DD/MM/YYYY").messages({
    "date.format": "Date of birth should be in 'DD/MM/YYYY' format",
  }),
  username: joi.string().alphanum().min(3).max(20).allow("").messages({
    "string.base": "Username should be a string",
    "string.min": "Username must have at least 3 characters",
    "string.max": "Username must have at most 20 characters",
  }),
  cpf: joi
    .string()
    .allow("")
    .regex(/^[0-9]{11}$/)
    .messages({
      "string.pattern.base": "'cpf' must have 11 digits",
    }),
  rg: joi
    .string()
    .allow("")
    .regex(/^[0-9]{7,10}$/)
    .messages({
      "string.pattern.base": "'rg' must have 7 digits",
    }),
  passport: joi
    .string()
    .regex(/^[A-Z]{2}[0-9]{7}/)
    .allow("")
    .messages({
      "string.pattern.base": "'passport' must be in the pattern XX0000000",
    }),
  phone: joi
    .string()
    .allow("")
    .regex(/^[0-9]{11,13}$/)
    .messages({
      "string.pattern.base": "'phone' must have [11,13] digits",
    }),
  lsdEmail: joi
    .string()
    .allow("")
    .email({ minDomainSegments: 4 })
    .pattern(/^\w+([.-]?\w+)*@(lsd\.ufcg\.edu\.br)/),
  secondaryEmail: joi.string().allow("").email(),
  memberType: joi.string().allow("").valid("ADMIN", "STUDENT", "SUPPORT", "PROFESSOR", "EXTERNAL"),
  lattes: joi.string().allow(""),
  roomName: joi.string().allow(""),
  hasKey: joi.boolean().allow(null, ""),
  isBrazilian: joi.boolean().allow(null, "").default(false),
});

export async function validatePassportForForeigners(body) {
  if (!body.isBrazilian && !body.passport.trim()) {
    return false;
  }
  return true;
}

export async function validateRgCpfForBrazilians(body) {
  if (body.isBrazilian && !body.cpf.trim() && !body.rg.trim()) {
    return false;
  }
  return true;
}
