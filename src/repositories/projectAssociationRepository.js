import prisma from "../database/prismaClient";

export async function insertProjectAssociation({
  projectId,
  memberId,
  startDate,
  endDate,
  isActive,
}) {
  const association = await prisma.projectAssociation.create({
    data: {
      projectId,
      memberId,
      startDate,
      endDate,
      isActive,
    },
  });
  return association;
}

export async function findByProjectId(projectId) {
  const association = await prisma.projectAssociation.findMany({
    where: {
      projectId: Number(projectId), //TO-DO tirar esse Number, deveria já estar certinho desde o controller
    },
    include: {
      member: true,
      project: true,
    },
  });
  return association;
}

export async function findByMemberId(memberId) {
  const association = await prisma.projectAssociation.findMany({
    where: {
      memberId: memberId,
    },
    include: {
      member: true,
      project: true,
    },
  });

  return association;
}

export async function findByProjectIdAndMemberId(projectId, memberId) {
  const association = await prisma.projectAssociation.findFirst({
    where: {
      projectId: projectId,
      memberId: memberId,
    },
  });

  return association;
}

export async function updateAssociation({ projectId, memberId, startDate, endDate, isActive }) {
  const association = await prisma.projectAssociation.update({
    where: {
      projectId_memberId: { projectId, memberId },
    },
    data: {
      endDate: endDate,
      startDate: startDate,
      isActive: isActive,
    },
  });
  return association;
}
