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
  services,
  registrationStatus,
}) {
  return await prisma.member.create({
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
      services,
      registrationStatus: {
        create: {
          ...registrationStatus,
        },
      },
    },
    include: {
      registrationStatus: true,
    },
  });
}

export async function getMemberById(id) {
  return await prisma.member.findUnique({
    where: { id },
    include: { registrationStatus: true, projectAssociation: true },
  });
}

export async function getMemberByCpf(cpf) {
  return await prisma.member.findFirst({
    where: { cpf },
    include: { registrationStatus: true, projectAssociation: true },
  });
}

export async function getMemberByRg(rg) {
  return await prisma.member.findFirst({
    where: { rg },
    include: { registrationStatus: true, projectAssociation: true },
  });
}

export async function getMemberByPassport(passport) {
  return await prisma.member.findFirst({
    where: { passport },
    include: { registrationStatus: true, projectAssociation: true },
  });
}

export async function getMemberBySecondaryEmail(secondaryEmail) {
  return await prisma.member.findFirst({
    where: { secondaryEmail },
    include: { registrationStatus: true, projectAssociation: true },
  });
}

export async function getMemberByLattes(lattes) {
  return await prisma.member.findFirst({
    where: { lattes },
    include: { registrationStatus: true, projectAssociation: true },
  });
}

export async function getMemberByEmailLsd(lsdEmail) {
  return await prisma.member.findFirst({
    where: { lsdEmail },
    include: { registrationStatus: true, projectAssociation: true },
  });
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

export async function deactivateMember(id) {
  const member = await prisma.member.update({
    where: { id: id },
    data: {
      isActive: false,
    },
  });
  return member;
}
export async function getAllMembers({ isActive, orderBy, status, createdBy }) {
  return prisma.member.findMany({
    where: {
      isActive,
      registrationStatus: { status, createdBy },
    },
    orderBy: { name: orderBy },
    include: { registrationStatus: true, projectAssociation: true },
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
  phone,
  lattes,
  roomName,
  hasKey,
  isBrazilian,
  services,
  registrationStatus,
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
      phone,
      roomName,
      hasKey,
      isBrazilian,
      services,
      registrationStatus: {
        update: {
          ...registrationStatus,
        },
      },
    },
    include: {
      registrationStatus: true,
    },
  });
  return updatedMember;
}
