import * as memberRepository from "../repositories/memberRepository";
import * as dateUtils from "../utils/dateUtils";
import * as memberUtils from "../utils/memberUtils";

const MINIMUM_REQUIRED_AGE = 15;
async function createMember({
  name,
  email,
  birthDate,
  username,
  cpf,
  rg,
  passport,
  phone,
  lsdEmail,
  secondaryEmail,
  memberType,
  lattes,
  roomName,
  hasKey,
  isBrazilian,
}) {
  await memberUtils.checkMemberAlreadyExists(null, cpf, rg, passport, secondaryEmail);
  const dateFormated = new Date(dateUtils.dateToIso(birthDate));
  if (new Date().getFullYear() - dateFormated.getFullYear() <= MINIMUM_REQUIRED_AGE) {
    throw new Error("Invalid date, the member must have more than 15 years!");
  }
  try {
    const newMember = await memberRepository.insertMember({
      name,
      email,
      birthDate: dateFormated,
      username,
      cpf,
      rg,
      passport,
      phone,
      lsdEmail,
      secondaryEmail,
      memberType,
      lattes,
      roomName,
      hasKey,
      isBrazilian,
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

async function updateMember({
  id,
  name,
  email,
  birthDate,
  username,
  cpf,
  rg,
  passport,
  phone,
  lsdEmail,
  secondaryEmail,
  memberType,
  lattes,
  roomName,
  hasKey,
  isBrazilian,
}) {
  const toUpdateMember = await memberRepository.getMemberById(id);
  if (!toUpdateMember) {
    throw new Error("Member does not exist");
  }
  await memberUtils.checkMemberAlreadyExists(id, cpf, rg, passport, secondaryEmail);
  if (isBrazilian !== null && isBrazilian !== undefined) {
    await memberUtils.checkCpfRgPassportOnUpdate(isBrazilian, cpf, rg, passport, toUpdateMember);
  }
  let dateFormated = "";
  if (birthDate) {
    dateFormated = new Date(dateUtils.dateToIso(birthDate));
    if (new Date().getFullYear() - dateFormated.getFullYear() <= MINIMUM_REQUIRED_AGE) {
      throw new Error("Invalid date, the member must be older than 15 years!");
    }
  }
  try {
    const updatedMember = await memberRepository.updateMember({
      id,
      name: name || toUpdateMember.name,
      email: email || toUpdateMember.email,
      birthDate: dateFormated || toUpdateMember.birthDate,
      username: username || toUpdateMember.username,
      cpf: cpf || toUpdateMember.cpf,
      rg: rg || toUpdateMember.rg,
      passport: passport || toUpdateMember.passport,
      phone: phone || toUpdateMember.phone,
      lsdEmail: lsdEmail || toUpdateMember.lsdEmail,
      secondaryEmail: secondaryEmail || toUpdateMember.secondaryEmail,
      memberType: memberType || toUpdateMember.memberType,
      lattes: lattes || toUpdateMember.lattes,
      roomName: roomName || toUpdateMember.roomName,
      hasKey: hasKey !== null && hasKey !== undefined ? hasKey : toUpdateMember.hasKey,
      isBrazilian:
        isBrazilian !== null && isBrazilian !== undefined
          ? isBrazilian
          : toUpdateMember.isBrazilian,
    });
    return updatedMember;
  } catch (err) {
    const errorColumn = err.message.substring(err.message.indexOf("(`"));
    throw new Error(
      `Already exists a member with this data on column ${errorColumn}, duplicate data!`
    );
  }
}

async function deleteMember(id) {
  const deletedMember = await memberRepository.deleteMember(id);
  return deletedMember;
}
export { createMember, getMemberById, getAllMembers, updateMember, deleteMember };
