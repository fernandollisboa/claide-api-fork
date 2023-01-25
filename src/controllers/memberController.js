import * as membersSchema from "../schemas/membersSchema";
import * as memberService from "../services/memberService";
import { parseBrDateToStandardDate } from "../utils/dateUtils";
import InvalidParamError from "../errors/InvalidParamError";

export async function createMember(req, res, next) {
  const { body } = req;
  let validationPassportForeigners;
  let validationCpfRgForBrazilians;

  const { authorization } = req.headers;
  const token = authorization?.split("Bearer ")[1];

  try {
    validationPassportForeigners = await membersSchema.validatePassportForForeigners(body);
    validationCpfRgForBrazilians = await membersSchema.validateRgCpfForBrazilians(body);
  } catch (err) {
    //TO-DO consertar isso, esse try/catch existe pois se vc mandar um body sem cpf/rg/passaport ele quebra
    return res.status(422).send(err.message);
  }

  if (!validationCpfRgForBrazilians) {
    return res.status(422).send("CPF or RG is necessary for brazilians!");
  }
  if (!validationPassportForeigners) {
    return res.status(422).send("Passport is necessary for foreigners!");
  }
  try {
    let { birthDate } = req.body;
    birthDate = parseBrDateToStandardDate(birthDate);
    const memberData = { ...body, birthDate };

    const createdMember = await memberService.createMember(memberData, token);

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
      birthDate = parseBrDateToStandardDate(birthDate);
    }
    const memberData = { ...body, birthDate };
    const newMember = await memberService.updateMember(memberData, token);

    return res.status(200).send(newMember);
  } catch (err) {
    next(err);
  }
}
