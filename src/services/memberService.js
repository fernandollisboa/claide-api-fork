import * as memberRepository from "../repositories/memberRepository";
import * as dateUtils from "../utils/dateUtils";

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
  isActive,
}) {
  const aux = await memberRepository.getMemberByCpf(cpf);
  if (aux !== undefined && aux !== null) {
    throw new Error("Member already exists");
  }
  const dateFormated = new Date(dateUtils.dateToIso(birthDate));
  return memberRepository.insertMember({
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
    isActive,
  });
}

async function getMember(id) {
  return memberRepository.getMemberById(id);
}

async function updateMember() {}

async function deleteMember(id) {
  return memberRepository.deleteMember(id);
}
export { createMember, getMember, updateMember, deleteMember };
