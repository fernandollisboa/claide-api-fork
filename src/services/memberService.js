import * as memberRepository from "../repositories/memberRepository";
import * as dateUtils from "../utils/dateUtils";
import * as memberUtils from "../utils/memberUtils";
import MemberTooYoungError from "../errors/MemberTooYoungError";

const MINIMUM_REQUIRED_AGE = 15;
async function createMember(memberData) {
  const {
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
  } = memberData;
  await memberUtils.checkMemberAlreadyExists({ cpf, rg, passport, secondaryEmail });

  const dateFormated = new Date(dateUtils.dateToIso(birthDate)); // TO-DO refatorar isso para dayjs

  if (new Date().getFullYear() - dateFormated.getFullYear() <= MINIMUM_REQUIRED_AGE) {
    throw new MemberTooYoungError();
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

//TO-DO essa função não deveria ser activateMember?
async function activeMember(username) {
  try {
    const member = await memberRepository.activeMember(username);

    return member;
  } catch (err) {
    throw new Error("Member not found");
  }
}

async function getAllMembers(isActive, orderBy) {
  return await memberRepository.getAllMembers(isActive, orderBy);
}

async function updateMember({ ...memberData }) {
  const {
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
  } = memberData;

  const toUpdateMember = await memberRepository.getMemberById(id);
  if (!toUpdateMember) {
    throw new Error("Member does not exist");
  }
  await memberUtils.checkMemberAlreadyExists({ id, cpf, rg, passport, secondaryEmail });
  if (isBrazilian !== null && isBrazilian !== undefined) {
    await memberUtils.checkMemberDocumentsOnUpdate({
      isBrazilian,
      cpf,
      rg,
      passport,
      existingMember: toUpdateMember,
    });
  }
  let dateFormated = "";
  if (birthDate) {
    dateFormated = new Date(dateUtils.dateToIso(birthDate)); // TO-DO trocar pra dayjs
    if (new Date().getFullYear() - dateFormated.getFullYear() <= MINIMUM_REQUIRED_AGE) {
      throw new MemberTooYoungError();
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
      hasKey: hasKey ?? toUpdateMember.hasKey,
      isBrazilian: isBrazilian ?? toUpdateMember.isBrazilian,
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
export { createMember, getMemberById, getAllMembers, updateMember, deleteMember, activeMember };
