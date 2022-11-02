import prisma from "../database/prismaClient";

export async function insertProject({
  name,
  creationDate,
  endDate,
  building,
  room,
  embrapii_code,
  financier,
  status,
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
      status,
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
  const projectToFind = await prisma.project.findUnique({
    where: {
      id: id,
    },
  });

  return projectToFind;
}

export async function findAll() {
  const projects = await prisma.project.findMany();
  return projects;
}
