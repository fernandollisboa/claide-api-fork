import dayjs from "dayjs";

import * as memberRepository from "../repositories/memberRepository";
import * as memberUtils from "../utils/memberUtils";
import MemberTooYoungError from "../errors/MemberTooYoungError";
import MemberNotFoundError from "../errors/MemberNotFoundError";
import * as activityRecordService from "./activityRecordService";
import { getUsername } from "../services/authService";

const MINIMUM_REQUIRED_AGE = 15;

async function createMember(memberData, token) {
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
  await memberUtils.checkMemberAlreadyExists(null, cpf, rg, passport, secondaryEmail); // TO-DO refatorar, um pouco feio mandar null, poderia ser desestruturado

  if (!isBirthDateValid(birthDate)) {
    throw new MemberTooYoungError();
  }

  const newMember = await memberRepository.insertMember({
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
  });

  const activity = {
    operation: "CREATE",
    entity: "MEMBER",
    newValue: newMember,
    idEntity: newMember.id,
    user: getUsername(token),
  };

  activityRecordService.createActivity(activity);

  return newMember;
}

function isBirthDateValid(birthDate) {
  const today = dayjs();
  const memberAge = today.diff(birthDate, "years", true);

  return memberAge >= MINIMUM_REQUIRED_AGE;
}

async function getMemberById(id) {
  const member = await memberRepository.getMemberById(id);

  if (!member) {
    throw new MemberNotFoundError("id", id);
  }

  return member;
}

async function activateMember(id) {
  try {
    const member = await memberRepository.activateMember(id);

    return member;
  } catch (err) {
    throw new MemberNotFoundError("memberId", id);
  }
}

async function deactivateMember(id) {
  try {
    const member = await memberRepository.deactivateMember(id);

    return member;
  } catch (err) {
    throw new MemberNotFoundError("memberId", id);
  }
}
//TO-DO refatorar isso pra destructuring: getAllMembers({isActive, orderBy})
async function getAllMembers(isActive, orderBy) {
  return memberRepository.getAllMembers(isActive, orderBy);
}

//TO-DO ver se precisa mesmo desse destructurign
async function updateMember(memberData, token) {
  const {
    id,
    name,
    email,
    username,
    cpf,
    rg,
    birthDate,
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
    throw new MemberNotFoundError("Member does not exist");
  }

  await memberUtils.checkMemberAlreadyExists(id, cpf, rg, passport, secondaryEmail);
  if (isBrazilian !== null && isBrazilian !== undefined) {
    await memberUtils.checkMemberDocumentsOnUpdate({
      isBrazilian,
      cpf,
      rg,
      passport,
      existingMember: toUpdateMember,
    });
  }

  if (birthDate) {
    if (!isBirthDateValid(birthDate)) {
      throw new MemberTooYoungError();
    }
  }

  try {
    const updatedMember = await memberRepository.updateMember({
      id,
      name: name || toUpdateMember.name,
      email: email || toUpdateMember.email,
      birthDate: birthDate || toUpdateMember.birthDate,
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
    const activity = {
      operation: "UPDATE",
      entity: "MEMBER",
      oldValue: toUpdateMember,
      newValue: updatedMember,
      idEntity: updatedMember.id,
      user: getUsername(token),
    };
    activityRecordService.createActivity(activity);

    return updatedMember;
  } catch (err) {
    const errorColumn = err.message.substring(err.message.indexOf("(`"));
    throw new Error(
      `Already exists a member with this data on column ${errorColumn}, duplicate data!`
    );
  }
}

async function deleteMember(id) {
  const member = await memberRepository.getMemberById(id);
  if (!member) {
    throw new MemberNotFoundError("id", id);
  }
  const deletedMember = await memberRepository.deleteMember(id);
  return deletedMember;
}
export {
  createMember,
  getMemberById,
  getAllMembers,
  updateMember,
  deleteMember,
  activateMember,
  deactivateMember,
};
