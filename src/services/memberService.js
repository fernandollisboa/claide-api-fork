import * as memberRepository from "../repositories/memberRepository";

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
  secondEmail,
  personType,
  lattes,
  room,
  hasKey,
  isActive,
}) {
  return memberRepository.insertMember({
    name,
    email,
    birthDate,
    username,
    cpf,
    rg,
    passport,
    phone,
    lsdEmail,
    secondEmail,
    personType,
    lattes,
    room,
    hasKey,
    isActive,
  });
}

async function getMember(id) {
  return memberRepository.getMember(id);
}

async function deleteMember(id) {
  return memberRepository.deleteMember(id);
}
export { createMember, getMember, deleteMember };
