import prisma from "../database/prismaClient";

export async function insertMember({
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
  return prisma.member.create({
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
}

export async function getMemberById(id) {
  return await prisma.member.findUnique({ where: { id } });
}

export async function getMemberByCpf(cpf) {
  return await prisma.member.findFirst({ where: { cpf } });
}

export async function getMemberByRg(rg) {
  return await prisma.member.findFirst({ where: { rg } });
}

export async function getMemberByPassport(passport) {
  return await prisma.member.findFirst({ where: { passport } });
}

export async function getMemberBySecondaryEmail(secondaryEmail) {
  return await prisma.member.findFirst({ where: { secondaryEmail } });
}

export async function activateMember(id) {
  const member = await prisma.member.update({
    where: { id: id },
    data: {
      isActive: true,
    },
  });
  return member;
}

//TO-DO refatorar pra chamar atraves de destructuring:  getAllMembers(isActive, orderBy)
export async function getAllMembers(isActive, orderBy) {
  return prisma.member.findMany({
    where: { isActive },
    orderBy: { name: orderBy },
  });
}

export async function updateMember({
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
    where: { id },
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

export async function deleteMember(id) {
  await prisma.member.delete({ where: { id } });
}
