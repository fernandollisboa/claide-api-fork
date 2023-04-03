import dayjs from "dayjs";
import * as memberRepository from "../repositories/memberRepository";
import * as memberUtils from "../utils/memberUtils";
import MemberTooYoungError from "../errors/MemberTooYoungError";
import MemberNotFoundError from "../errors/MemberNotFoundError";
import * as activityRecordService from "./activityRecordService";
import { getUsername, getRole } from "../services/authService";
import BaseError from "../errors/BaseError";
import UserUnauthorizedOrNotFoundError from "../errors/UserUnauthorizedOrNotFoundError";
import MemberNotApproved from "../errors/MemberNotApproved";

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

  await memberUtils.checkMemberAlreadyExists({
    cpf,
    rg,
    passport,
    secondaryEmail,
    lattes,
    lsdEmail,
  });

  if (!isBirthDateValid(birthDate)) {
    throw new MemberTooYoungError();
  }
  const registrationStatus = createRegistrationStatus(token);

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
    registrationStatus,
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

function createRegistrationStatus(token) {
  const role = getRole(token);
  const status = role.includes("SUPPORT") === true ? "APPROVED" : "PENDING";
  const creator = getUsername(token);
  const registrationStatus = {
    status,
    createdBy: creator,
    reviewedBy: role.includes("SUPPORT") === true ? creator : null,
  };

  return registrationStatus;
}

function isBirthDateValid(birthDate) {
  const today = dayjs();
  const memberAge = today.diff(birthDate, "years", true);

  return memberAge >= MINIMUM_REQUIRED_AGE;
}

export async function setStatusRegistration(body, id, token) {
  const { status, comment } = body;
  const role = getRole(token);

  if (!role.includes("SUPPORT")) {
    throw new UserUnauthorizedOrNotFoundError(
      getUsername(token),
      `User ${getUsername(token)} doesn't have support role`
    );
  }

  const member = await getMemberById(Number(id));

  const registrationStatus = {
    ...member.registrationStatus,
    status,
    comment,
    reviewedBy: getUsername(token),
  };

  const updatedMember = await memberRepository.updateMember({ ...member, registrationStatus });

  const activity = {
    operation: "UPDATE",
    entity: "MEMBER",
    newValue: updatedMember,
    idEntity: updatedMember.id,
    user: getUsername(token),
  };

  activityRecordService.createActivity(activity);

  return updatedMember;
}

async function getMemberById(id) {
  const member = await memberRepository.getMemberById(id);

  if (!member) {
    throw new MemberNotFoundError("id", id);
  }

  return member;
}

async function activateMember(id) {
  const member = await getMemberById(id);
  if (member.registrationStatus.status !== "APPROVED") {
    throw new MemberNotApproved(member.name);
  }
  const memberActived = await memberRepository.activateMember(id);
  return memberActived;
}

async function deactivateMember(id) {
  try {
    const member = await memberRepository.deactivateMember(id);

    return member;
  } catch (err) {
    throw new MemberNotFoundError("memberId", id);
  }
}

async function getAllMembers({
  isActiveBoolean: isActive,
  order: orderBy,
  status_: status,
  creator: createdBy,
} = {}) {
  return memberRepository.getAllMembers({ isActive, orderBy, status, createdBy });
}

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
    throw new MemberNotFoundError("Id", id);
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
      cpf: cpf ?? toUpdateMember.cpf,
      rg: rg ?? toUpdateMember.rg,
      passport: passport ?? toUpdateMember.passport,
      phone: phone || toUpdateMember.phone,
      lsdEmail: lsdEmail ?? toUpdateMember.lsdEmail,
      secondaryEmail: secondaryEmail ?? toUpdateMember.secondaryEmail,
      memberType: memberType ?? toUpdateMember.memberType,
      lattes: lattes ?? toUpdateMember.lattes,
      roomName: roomName ?? toUpdateMember.roomName,
      hasKey: hasKey || toUpdateMember.hasKey,
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
    throw new BaseError(
      `Already exists a member with this data on column ${errorColumn}, duplicate data!`,
      409
    );
  }
}

export {
  createMember,
  getMemberById,
  getAllMembers,
  updateMember,
  activateMember,
  deactivateMember,
};
