import prisma from "../database/prismaClient";

async function insertService({ name }) {
  const newService = await prisma.services.create({ data: { name } });
  return newService;
}

async function getAllServices() {
  return await prisma.services.findMany();
}

export { insertService, getAllServices };
