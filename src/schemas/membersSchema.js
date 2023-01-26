import joiBase from "joi";
import extension from "@joi/date";

const joi = joiBase.extend(extension);
export const createMemberSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().required().email(),
  birthDate: joi.date().iso().required(),
  username: joi.string().min(3).max(20).required(),
  cpf: joi
    .string()
    .allow("")
    .regex(/^[0-9]{11}$/)
    .messages({
      "string.pattern.base": `"cpf" must have 11 digits`,
    }),
  rg: joi.string().allow(""),
  passport: joi.string().allow(""),
  phone: joi.string().required().allow(""),
  lsdEmail: joi
    .string()
    .email({ minDomainSegments: 4 })
    .allow("")
    .pattern(/^\w+([.-]?\w+)*@(lsd\.ufcg\.edu\.br)/),
  secondaryEmail: joi.string().allow("").email(),
  memberType: joi.string().valid("ADMIN", "STUDENT", "SUPPORT", "PROFESSOR", "EXTERNAL").required(),
  lattes: joi.string().trim().allow(""),
  roomName: joi.string().allow(""),
  hasKey: joi.boolean().required(),
  isActive: joi.boolean().default(false),
  isBrazilian: joi.boolean().required(),
});

export const updateMemberSchema = joi.object({
  id: joi.number().required(),
  name: joi.string(),
  email: joi.string().allow("").email(),
  birthDate: joi.date().allow("").iso(),
  username: joi.string().min(3).max(20).allow(""),
  cpf: joi
    .string()
    .allow("")
    .regex(/^[0-9]{11}$/)
    .messages({
      "string.pattern.base": `"cpf" must have 11 digits`,
    }),
  rg: joi.string().allow(""),
  passport: joi.string().allow(""),
  phone: joi.string().allow(""),
  lsdEmail: joi
    .string()
    .allow("")
    .email({ minDomainSegments: 4 })
    .pattern(/^\w+([.-]?\w+)*@(lsd\.ufcg\.edu\.br)/),
  secondaryEmail: joi.string().allow("").email(),
  memberType: joi.string().allow("").valid("ADMIN", "STUDENT", "SUPPORT", "PROFESSOR", "EXTERNAL"),
  lattes: joi.string().allow(""),
  roomName: joi.string().allow(""),
  hasKey: joi.boolean().allow(""),
  isBrazilian: joi.boolean().allow(""),
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
