import * as membersSchema from "../schemas/membersSchema";
import * as memberService from "../services/memberService";

async function createMember(req, res) {
  const { body } = req;
  const joiValidation = membersSchema.createMemberSchema.validate(body);
  // try {
  // } catch (error) {;
  //   return res.status(400).;
  // }

  if (joiValidation.error) {
    const typeError = joiValidation.error.details[0].type;
    if (typeError === "any.required" || typeError === "object.unknown") {
      return res.status(422).send(joiValidation.error.details[0].message);
    }
    return res.status(400).send(joiValidation.error.details[0].message);
  }

  try {
    const createdMember = await memberService.createMember(body);
    return res.status(201).send(createdMember);
  } catch (err) {
    return res.status(409).send(err.message);
  }
}

async function getMember(req, res) {
  const { id } = req.params.id;

  const member = await memberService.getMember(id);

  return res.status(200).send(member);
}

async function updateMember() {}

async function deleteMember(req, res) {
  const { id } = req.params.id;

  const member = await memberService.deleteMember(id);

  return res.status(200).send(member);
}
export { createMember, getMember, updateMember, deleteMember };
