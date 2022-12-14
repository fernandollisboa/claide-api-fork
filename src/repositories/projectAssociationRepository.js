import prisma from "../database/prismaClient";

export async function insertProjectAssociation({ projectId, memberId, startDate, endDate }) {
  const association = await prisma.projectAssociation.create({
    data: {
      projectId,
      memberId,
      startDate,
      endDate,
    },
  });
  return association;
}

export async function findByProjectId(projectId) {
  const association = await prisma.projectAssociation.findMany({
    where: {
      projectId: Number(projectId), //TO-DO tirar esse Number, deveria já estar certinho desde o controller
    },
  });
  return association;
}

export async function findByMemberId(memberId) {
  const association = await prisma.projectAssociation.findMany({
    where: {
      memberId: memberId,
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

export async function updateAssociation({ projectId, memberId, startDate, endDate }) {
  const association = await prisma.projectAssociation.update({
    where: {
      projectId_memberId: { projectId, memberId },
    },
    data: {
      endDate: endDate || undefined,
      startDate: startDate || undefined,
    },
  });
  return association;
}
