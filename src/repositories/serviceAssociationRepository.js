import prisma from "../database/prismaClient";

async function insertServiceAssociation({ memberId, serviceId }) {
  const newServiceAssociation = await prisma.serviceAssociation.create({
    data: {
      memberId,
      serviceId,
    },
  });
  return newServiceAssociation;
}

async function getAllAssociations() {
  return await prisma.serviceAssociation.findMany();
}

async function getAllAssociationsByServiceId(id) {
  return await prisma.serviceAssociation.findMany({
    where: { serviceId: id },
    include: {
      service: true,
    },
  });
}

async function getAllAssociationsByMemberId(id) {
  return await prisma.serviceAssociation.findMany({
    where: { memberId: id },
    include: {
      service: true,
    },
  });
}

export {
  insertServiceAssociation,
  getAllAssociations,
  getAllAssociationsByServiceId,
  getAllAssociationsByMemberId,
};
