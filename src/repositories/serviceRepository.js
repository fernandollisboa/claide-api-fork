import prisma from "../database/prismaClient";
import ServiceNotFoundError from "../errors/ServiceNotFoundError";

async function insertService({ name }) {
  const newService = await prisma.services.create({ data: { name } });
  return newService;
}

async function getAllServices() {
  return await prisma.services.findMany();
}

async function findServiceById(id) {
  return prisma.services
    .findUniqueOrThrow({
      where: { id: id },
    })
    .catch(() => {
      throw new ServiceNotFoundError("id", id);
    });
}

async function findServiceByName(name) {
  return prisma.services
    .findUniqueOrThrow({
      where: { name: name },
    })
    .catch(() => {
      throw new ServiceNotFoundError("name", name);
    });
}

async function updateService({ id, name }) {
  const updatedService = await prisma.services.update({
    where: { id: id },
    data: { name },
  });

  return updatedService;
}

export { insertService, getAllServices, findServiceById, findServiceByName, updateService };
