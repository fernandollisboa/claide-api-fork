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
  secondEmail,
  personType,
  lattes,
  room,
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
      secondEmail,
      personType,
      lattes,
      room,
      hasKey,
      isActive,
    },
  });
  return member;
}

async function getMember(id) {
  const member = await prisma.member.findOne({ where: { id: id } });

  return member;
}

async function deleteMember(id) {
  const member = await prisma.member.findOne({ where: { id: id } });
  await prisma.member.delete({ where: { id: id } });
  return member;
}
export { insertMember, getMember, deleteMember };
