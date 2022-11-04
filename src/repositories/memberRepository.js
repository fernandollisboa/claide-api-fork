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
  isActive,
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
      isActive,
    },
  });
  return member;
}

async function getMemberById(id) {
  return await prisma.member.findUnique({ where: { id: id } });
}

async function getMemberByCpf(cpf) {
  return await prisma.member.findUnique({ where: { cpf: cpf } });
}

async function getAllMembers() {
  return await prisma.member.findMany();
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
}) {
  const updatedMember = await prisma.member.update({
    where: { id: id },
    data: {
      name: name,
      email: email,
      birthDate: birthDate,
      username: username,
      cpf: cpf,
      rg: rg,
      passport: passport,
      lsdEmail: lsdEmail,
      secondaryEmail: secondaryEmail,
      memberType: memberType,
      lattes: lattes,
      roomName: roomName,
      hasKey: hasKey,
    },
  });
  return updatedMember;
}

async function deleteMember(id) {
  const member = await prisma.member.findUnique({ where: { id: id } });
  await prisma.member.delete({ where: { id: id } });
  return member;
}
export { insertMember, getMemberById, getMemberByCpf, getAllMembers, updateMember, deleteMember };
