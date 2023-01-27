import * as membersSchema from "../schemas/membersSchema";
import * as memberService from "../services/memberService";
import InvalidParamError from "../errors/InvalidParamError";
import InvalidAtributeError from "../errors/InvalidAtributeError";

export async function createMember(req, res, next) {
  const { body } = req;

  const { authorization } = req.headers;
  const token = authorization?.split("Bearer ")[1];

  const validationPassportForeigners = await membersSchema.validatePassportForForeigners(body);
  const validationCpfRgForBrazilians = await membersSchema.validateRgCpfForBrazilians(body);

  try {
    if (!validationCpfRgForBrazilians) {
      const value = `empty`;
      throw new InvalidAtributeError("cpf and rg", value);
    }
    if (!validationPassportForeigners) {
      throw new InvalidAtributeError("passport", "empty");
    }
    let { birthDate } = req.body;
    birthDate = new Date(birthDate);
    const memberData = { ...body, birthDate };

    const createdMember = await memberService.createMember(memberData, token);
    //const createdMember = await memberService.createMember(body, token);

    return res.status(201).send(createdMember);
  } catch (err) {
    next(err);
  }
}

export async function getMemberById(req, res, next) {
  const { id: idToken } = req.params;
  const id = Number(idToken);
  try {
    if (isNaN(id)) throw new InvalidParamError("memberId", id);

    const member = await memberService.getMemberById(id);

    return res.status(200).send(member);
  } catch (err) {
    next(err);
  }
}

export async function getAllMembers(req, res, next) {
  const { isActive, desc } = req.query;

  let isActiveBoolean, order;
  if (isActive) {
    isActiveBoolean = isActive === "true";
  }
  if (desc) {
    order = desc === "true" ? "desc" : "asc";
  }
  try {
    const members = await memberService.getAllMembers({ isActiveBoolean, order });

    return res.status(200).send(members);
  } catch (err) {
    next(err);
  }
}
export async function updateMember(req, res, next) {
  const { body } = req;
  let { birthDate } = body;

  const { authorization } = req.headers;
  const token = authorization?.split("Bearer ")[1];

  try {
    if (birthDate) {
      birthDate = new Date(birthDate);
    }
    const memberData = { ...body, birthDate };
    const newMember = await memberService.updateMember(memberData, token);
    //const newMember = await memberService.updateMember(body, token);

    return res.status(200).send(newMember);
  } catch (err) {
    next(err);
  }
}
