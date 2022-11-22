import prisma from "../database/prismaClient";

async function insertMember({
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
  const member = await prisma.member.create({
    data: {
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
    },
  });
  return member;
}

async function getMemberById(id) {
  return await prisma.member.findUnique({ where: { id: id } });
}

async function getMemberByCpf(cpf) {
  return await prisma.member.findFirst({ where: { cpf: cpf } });
}

async function getMemberByRg(rg) {
  return await prisma.member.findFirst({ where: { rg: rg } });
}

async function getMemberByPassport(passport) {
  return await prisma.member.findFirst({ where: { passport: passport } });
}

async function getMemberBySecondaryEmail(secondaryEmail) {
  return await prisma.member.findFirst({ where: { secondaryEmail: secondaryEmail } });
}

async function getMemberByUsername(username) {
  return await prisma.member.findFirst({ where: { username: username } });
}

async function getAllMembers(isActive, orderBy) {
  return await prisma.member.findMany({
    where: { isActive: isActive },
    orderBy: { name: orderBy },
  });
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
  lsdEmail,
  secondaryEmail,
  memberType,
  lattes,
  roomName,
  hasKey,
  isBrazilian,
}) {
  const updatedMember = await prisma.member.update({
    where: { id: id },
    data: {
      name,
      email,
      birthDate,
      username,
      cpf,
      rg,
      passport,
      lsdEmail,
      secondaryEmail,
      memberType,
      lattes,
      roomName,
      hasKey,
      isBrazilian,
    },
  });
  return updatedMember;
}

async function deleteMember(id) {
  const member = await prisma.member.findUnique({ where: { id: id } });
  await prisma.member.delete({ where: { id: id } });
  return member;
}
export {
  insertMember,
  getMemberById,
  getMemberByCpf,
  getMemberByRg,
  getMemberByPassport,
  getMemberBySecondaryEmail,
  getAllMembers,
  updateMember,
  deleteMember,
  getMemberByUsername,
};
