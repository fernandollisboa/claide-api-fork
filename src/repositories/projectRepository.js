import prisma from "../database/prismaClient";

export async function insertProject({
  name,
  creationDate,
  endDate,
  building,
  room,
  embrapii_code,
  financier,
  isActive,
}) {
  const project = await prisma.project.create({
    data: {
      name,
      creationDate,
      endDate,
      building,
      room,
      embrapii_code,
      financier,
      isActive,
    },
  });
  return project;
}

export async function findByName(name) {
  const projectTofind = await prisma.project.findMany({
    where: {
      name: name,
    },
  });
  return projectTofind;
}

export async function findByEmbrapiiCode(code) {
  const projectToFind = await prisma.project.findMany({
    where: {
      embrapii_code: code,
    },
  });

  return projectToFind;
}

export async function findById(id) {
  const projectToFind = await prisma.project.findFirst({
    where: {
      id: parseInt(id),
    },
  });

  return projectToFind;
}

export async function updateProject({
  id,
  name,
  creationDate,
  endDate,
  building,
  room,
  embrapii_code,
  financier,
  isActive,
}) {
  const project = await prisma.project.update({
    where: {
      id: parseInt(id),
    },
    data: {
      name: name || undefined,
      creationDate: creationDate || undefined,
      endDate: endDate || undefined,
      building: building || undefined,
      room: room || undefined,
      embrapii_code: embrapii_code || undefined,
      financier: financier || undefined,
      isActive: isActive,
    },
  });
  return project;
}

export async function findAll(isActive, order) {
  const projects = await prisma.project.findMany({
    where: {
      isActive: isActive,
    },
    orderBy: {
      name: order,
    },
  });
  return projects;
}
