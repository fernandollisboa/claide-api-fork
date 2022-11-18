import * as membersSchema from "../schemas/membersSchema";
import * as memberService from "../services/memberService";

async function createMember(req, res) {
  const { body } = req;
  const joiValidation = membersSchema.createMemberSchema.validate(body);
  const validationPassportForeigners = await membersSchema.validatePassportForForeigners(body);
  const validationCpfRgForBrazilians = await membersSchema.validateRgCpfForBrazilians(body);

  if (joiValidation.error) {
    const typeError = joiValidation.error.details[0].type;
    if (typeError === "any.required" || typeError === "object.unknown") {
      return res.status(400).send(joiValidation.error.details[0].message);
    }
    return res.status(422).send(joiValidation.error.details[0].message);
  }

  if (!validationCpfRgForBrazilians) {
    return res.status(422).send("CPF or RG is necessary for brazilians!");
  }
  if (!validationPassportForeigners) {
    return res.status(422).send("Passport is necessary for foreigners!");
  }

  try {
    const createdMember = await memberService.createMember(body);
    return res.status(201).send(createdMember);
  } catch (err) {
    return res.status(409).send(err.message);
  }
}

async function getMemberById(req, res) {
  const id = parseInt(req.params.id);

  try {
    const member = await memberService.getMemberById(id);

    return res.status(200).send(member);
  } catch (err) {
    return res.status(404).send(err.message);
  }
}

async function getAllMembers(req, res) {
  const { isActive, desc } = req.query;
  let isActiveBoolean;
  let organization;
  if (isActive) {
    isActiveBoolean = isActive === "true";
  }
  if (desc) {
    organization = desc === "true" ? "desc" : "asc";
  }
  const members = await memberService.getAllMembers(isActiveBoolean, organization);
  return res.status(200).send(members);
}

async function updateMember(req, res) {
  const { body } = req;
  const joiValidation = membersSchema.updateMemberSchema.validate(body);

  if (joiValidation.error) {
    const typeError = joiValidation.error.details[0].type;
    if (typeError === "any.required" || typeError === "object.unknown") {
      return res.status(400).send(joiValidation.error.details[0].message);
    }
    return res.status(422).send(joiValidation.error.details[0].message);
  }

  try {
    const member = await memberService.updateMember(body);
    return res.status(200).send(member);
  } catch (err) {
    return res.status(422).send(err.message);
  }
}

async function deleteMember(req, res) {
  const id = parseInt(req.params.id);

  const member = await memberService.deleteMember(id);

  return res.status(200).send(member);
}
export { createMember, getMemberById, getAllMembers, updateMember, deleteMember };
