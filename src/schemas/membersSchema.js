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
      "string.pattern.base": '"cpf" must have 11 digits',
    })
    .required(),
  rg: joi.string().allow("").required(),
  passport: joi.string().allow("").required(),
  phone: joi.string().required(),
  lsdEmail: joi
    .string()
    .email({ minDomainSegments: 4 })
    .allow("")
    .pattern(/^\w+([.-]?\w+)*@(lsd\.ufcg\.edu\.br)/)
    .required(),
  secondaryEmail: joi.string().allow("").email().required(),
  memberType: joi.string().valid("ADMIN", "STUDENT", "SUPPORT", "PROFESSOR", "EXTERNAL").required(),
  lattes: joi.string().trim().allow("").required(),
  roomName: joi.string().allow("").required(),
  hasKey: joi.boolean().required(),
  isActive: joi.boolean().default(false),
  isBrazilian: joi.boolean().required(),
});

export const updateMemberSchema = joi.object({
  name: joi.string(),
  email: joi.string().email(),
  birthDate: joi.date().iso(),
  username: joi.string().min(3).max(20),
  cpf: joi
    .string()
    .allow("")
    .regex(/^[0-9]{11}$/)
    .messages({
      "string.pattern.base": '"cpf" must have 11 digits',
    }),
  rg: joi.string().allow(""),
  passport: joi.string().allow(""),
  phone: joi.string(),
  lsdEmail: joi
    .string()
    .allow("")
    .email({ minDomainSegments: 4 })
    .pattern(/^\w+([.-]?\w+)*@(lsd\.ufcg\.edu\.br)/),
  secondaryEmail: joi.string().allow("").email(),
  memberType: joi.string().valid("ADMIN", "STUDENT", "SUPPORT", "PROFESSOR", "EXTERNAL"),
  lattes: joi.string().allow(""),
  roomName: joi.string().allow(""),
  hasKey: joi.boolean(),
  isBrazilian: joi.boolean(),
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

export const setStatusRegistrationSchema = joi.object({
  status: joi.string().valid("APPROVED", "REJECTED", "PENDING").required(),
  comment: joi.string().allow(""),
});
