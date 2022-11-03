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
  const member = await prisma.member.findUnique({ where: { id: id } });
  return member;
}

async function getMemberByCpf(cpf) {
  const member = await prisma.member.findUnique({ where: { cpf: cpf } });

  return member;
}

async function updateMember() {}

async function deleteMember(id) {
  const member = await prisma.member.findUnique({ where: { id: id } });
  await prisma.member.delete({ where: { id: id } });
  return member;
}
export { insertMember, getMemberById, getMemberByCpf, updateMember, deleteMember };
