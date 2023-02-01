import prisma from "../database/prismaClient";
import ServiceNotFoundError from "../errors/ServiceNotFoundError";

async function insertService({ name }) {
  const newService = await prisma.service.create({ data: { name } });
  return newService;
}

async function getAllServices() {
  return await prisma.service.findMany();
}

async function findServiceById(id) {
  return prisma.service
    .findUniqueOrThrow({
      where: { id: id },
    })
    .catch(() => {
      throw new ServiceNotFoundError("id", id);
    });
}

async function findServiceByName(name) {
  return prisma.service
    .findUniqueOrThrow({
      where: { name: name },
    })
    .catch(() => {
      throw new ServiceNotFoundError("name", name);
    });
}

async function updateService({ id, name }) {
  const updatedService = await prisma.service.update({
    where: { id: id },
    data: { name },
  });

  return updatedService;
}

export { insertService, getAllServices, findServiceById, findServiceByName, updateService };
