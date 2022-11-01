import { signupSchema } from "../schemas/signupSchema";
import * as memberService from "../services/memberService";

async function createMember(req, res) {
  const { body } = req;
  const joiValidation = signupSchema.validate(body);

  if (joiValidation.error) {
    return res.status(400).send(joiValidation.error.details);
  }

  const createdMember = await memberService.createMember(body);

  return res.status(201).send(createdMember);
}

async function getMember(req, res) {
  const { id } = req.params;

  const member = await memberService.getMember(id);

  return res.status(200).send(member);
}

async function deleteMember(req, res) {
  const { id } = req.params;

  const member = await memberService.deleteMember(id);

  return res.status(200).send(member);
}
export { createMember, getMember, deleteMember };
