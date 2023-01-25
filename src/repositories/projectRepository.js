import prisma from "../database/prismaClient";

export async function insertProject({
  name,
  creationDate,
  endDate,
  building,
  room,
  embrapiiCode,
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
      embrapiiCode,
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
      embrapiiCode: code,
    },
  });

  return projectToFind;
}

//TO-DO tirar esse Number, deveria já estar certinho desde o controller
export async function findById(id) {
  const projectToFind = await prisma.project.findFirst({
    where: {
      id: Number(id),
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
  embrapiiCode,
  financier,
  isActive,
}) {
  const project = await prisma.project.update({
    where: {
      id: Number(id), //TO-DO tirar esse Number, deveria já estar certinho desde o controller
    },
    data: {
      name: name || undefined,
      creationDate: creationDate || undefined,
      endDate: endDate || undefined,
      building: building || undefined,
      room: room || undefined,
      embrapiiCode: embrapiiCode || undefined,
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
