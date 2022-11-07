import * as memberRepository from "../repositories/memberRepository";
import * as dateUtils from "../utils/dateUtils";
import * as memberUtils from "../utils/memberUtils";

async function createMember(body) {
  await memberUtils.checkMemberAlreadyExists(body);
  const dateFormated = new Date(dateUtils.dateToIso(body.birthDate));
  if (dateFormated.getFullYear() >= 2007) {
    throw new Error("Invalid date");
  }
  try {
    const newMember = await memberRepository.insertMember({
      name: body.name,
      email: body.email,
      birthDate: dateFormated,
      username: body.username,
      cpf: body.cpf,
      rg: body.rg,
      passport: body.passport || null,
      phone: body.phone,
      lsdEmail: body.lsdEmail,
      secondaryEmail: body.secondaryEmail,
      memberType: body.memberType,
      lattes: body.lattes,
      roomName: body.roomName,
      hasKey: body.hasKey,
      isBrazilian: body.isBrazilian,
    });
    return newMember;
  } catch (err) {
    const errorColumn = err.message.substring(err.message.indexOf("(`"));
    throw new Error(
      `Already exists a member with this data on column ${errorColumn}, duplicate data!`
    );
  }
}

async function getMemberById(id) {
  const member = await memberRepository.getMemberById(id);
  if (member === undefined || member === null) {
    throw new Error("Member not found");
  }
  return member;
}

async function getAllMembers() {
  return await memberRepository.getAllMembers();
}

async function updateMember(body) {
  const aux = await memberRepository.getMemberById(parseInt(body.id));
  if (aux === undefined && aux === null) {
    throw new Error("Member does not exist");
  }
  await memberUtils.checkMemberAlreadyExists(body);
  let dateFormated = "";
  if (body.birthDate !== undefined && body.birthDate !== null && body.birthDate !== "") {
    dateFormated = new Date(dateUtils.dateToIso(body.birthDate));
    if (dateFormated.getFullYear() >= 2007) {
      throw new Error("Invalid date");
    }
  }

  const updatedMember = await memberRepository.updateMember({
    id: parseInt(body.id),
    name: body.name || aux.name,
    email: body.email || aux.email,
    birthDate: dateFormated || aux.birthDate,
    username: body.username || aux.username,
    cpf: body.cpf || aux.cpf,
    rg: body.rg || aux.rg,
    passport: body.passport || aux.passport,
    phone: body.phone || aux.phone,
    lsdEmail: body.lsdEmail || aux.lsdEmail,
    secondaryEmail: body.secondaryEmail || aux.secondaryEmail,
    memberType: body.memberType || aux.memberType,
    lattes: body.lattes || aux.lattes,
    roomName: body.roomName || aux.roomName,
    hasKey: body.hasKey !== null && body.hasKey !== undefined ? body.hasKey : aux.hasKey,
    isBrazilian: body.isBrazilian,
  });

  return updatedMember;
}

async function deleteMember(id) {
  return memberRepository.deleteMember(id);
}
export { createMember, getMemberById, getAllMembers, updateMember, deleteMember };
