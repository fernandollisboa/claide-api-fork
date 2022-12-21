import joiBase from "joi";
import extension from "@joi/date";

const joi = joiBase.extend(extension);
//TO-DO padronizar mensagens de falha de validação
export const createMemberSchema = joi.object({
  name: joi
    .string()
    .regex(/^([a-zA-Z]{2,}\s[a-zA-Z])/)
    .required()
    .messages({
      "string.pattern.base": `"name" must have only letters and spaces, with at least two names (first name and last name)"`,
    }),
  email: joi.string().required().email(),
  birthDate: joi.date().format("DD/MM/YYYY").required(),
  username: joi.string().min(3).max(20).required(),
  cpf: joi
    .string()
    .regex(/^[0-9]{11}$/)
    .messages({
      "string.pattern.base": `"cpf" must have 11 digits`,
    }),
  rg: joi
    .string()
    .allow("")
    .regex(/^[0-9]{7,10}$/)
    .messages({
      "string.pattern.base": `"rg" must have 7-11 digits`,
    }),
  passport: joi
    .string()
    .allow("")
    .regex(/^[A-Z]{2}[0-9]{7}/),
  phone: joi
    .string()
    .regex(/^[0-9]{11,13}$/)
    .required()
    .messages({
      "string.pattern.base": `"phone" must have 11-13 digits`,
    }),
  lsdEmail: joi
    .string()
    .email({ minDomainSegments: 4 })
    .pattern(/^\w+([.-]?\w+)*@(lsd\.ufcg\.edu\.br)/),
  secondaryEmail: joi.string().allow("").email(),
  memberType: joi.string().valid("ADMIN", "STUDENT", "SUPPORT", "PROFESSOR", "EXTERNAL").required(),
  lattes: joi.string().trim(),
  roomName: joi.string(),
  hasKey: joi.boolean().required(),
  isActive: joi.boolean().default(false),
  isBrazilian: joi.boolean().required(),
});

export const updateMemberSchema = joi.object({
  id: joi.number().required(),
  name: joi
    .string()
    .regex(/^([a-zA-Z]{2,}\s[a-zA-Z])/)
    .allow("")
    .messages({
      "string.pattern.base":
        "Name should have only letters and spaces, with at least a name and a last name",
    }),
  email: joi.string().allow("").email(),
  birthDate: joi.date().allow("").format("DD/MM/YYYY"),
  username: joi.string().min(3).max(20).allow(""),
  cpf: joi
    .string()
    .allow("")
    .regex(/^[0-9]{11}$/)
    .messages({
      "string.pattern.base": `"cpf" must have 11 digits`,
    }),
  rg: joi
    .string()
    .allow("")
    .regex(/^[0-9]{7,10}$/)
    .messages({
      "string.pattern.base": `"rg" must have 7 digits`,
    }),
  passport: joi
    .string()
    .regex(/^[A-Z]{2}[0-9]{7}/)
    .allow("")
    .messages({
      "string.pattern.base": `"passport" must be in the format XX0000000`,
    }),
  phone: joi
    .string()
    .allow("")
    .regex(/^[0-9]{11,13}$/)
    .messages({
      "string.pattern.base": `"phone" must have 11-13 digits"`,
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
  isBrazilian: joi.boolean().allow(null, ""),
});

export async function validatePassportForForeigners(body) {
  if (!body.isBrazilian && !body.passport?.trim()) {
    return false;
  }
  return true;
}

export async function validateRgCpfForBrazilians(body) {
  if (body.isBrazilian && !body.cpf?.trim() && !body.rg?.trim()) {
    return false;
  }
  return true;
}
