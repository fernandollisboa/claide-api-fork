import prisma from "../database/prismaClient";

export async function insertProjectAssociation({ projectId, username, startDate, endDate }) {
  const association = await prisma.projectAssociation.create({
    data: {
      projectId,
      username,
      startDate,
      endDate,
    },
  });
  return association;
}

export async function findByProjectId(projectId) {
  const association = await prisma.projectAssociation.findMany({
    where: {
      projectId: parseInt(projectId),
    },
  });
  return association;
}

export async function findByUsername(username) {
  const association = await prisma.projectAssociation.findMany({
    where: {
      username: username,
    },
  });

  return association;
}

export async function findByProjectIdAndUsername(projectId, username) {
  const association = await prisma.projectAssociation.findFirst({
    where: {
      projectId: projectId,
      username: username,
    },
  });

  return association;
}

export async function updateAssociation({ projectId, username, startDate, endDate }) {
  const association = await prisma.projectAssociation.update({
    where: {
      projectId_username: { projectId, username },
    },
    data: {
      endDate: endDate || undefined,
      startDate: startDate || undefined,
    },
  });
  return association;
}
