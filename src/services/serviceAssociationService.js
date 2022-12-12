import * as serviceAssociationRepository from "../repositories/serviceAssociationRepository.js";
import ServiceNotFoundError from "../errors/ServiceNotFoundError";
import MemberNotFoundError from "../errors/MemberNotFoundError";
import { getMemberById } from "../services/memberService";

async function insertServiceAssociation({ memberId, serviceId }) {
  try {
    const newServiceAssociation = await serviceAssociationRepository.insertServiceAssociation({
      memberId,
      serviceId,
    });
    return newServiceAssociation;
  } catch (err) {
    // como melhorar aqui?
    const brokeConstraint = err.message.substring(err.message.indexOf(": `") + 2);

    if (brokeConstraint === "`ServiceAssociation_serviceId_fkey (index)`") {
      throw new ServiceNotFoundError("Id", serviceId);
    } else if (brokeConstraint === "`ServiceAssociation_memberId_fkey (index)`") {
      throw new MemberNotFoundError("Id", memberId);
    } else {
      throw new Error("There's already an association between this Service and this Member");
    }
  }
}

async function getAllServicesAssociations() {
  return await serviceAssociationRepository.getAllAssociations();
}

async function getServiceAssociationsByServiceId(id) {
  return await serviceAssociationRepository.getAllAssociationsByServiceId(id);
}

async function getServiceAssociationsByMemberId(id) {
  const member = await getMemberById(id);
  if (member) {
    const result = await serviceAssociationRepository.getAllAssociationsByMemberId(id);
    return result;
  }
  return member;
}

async function deleteAssociation() {
  return serviceAssociationRepository.deleteA();
}

export {
  insertServiceAssociation,
  getAllServicesAssociations,
  getServiceAssociationsByServiceId,
  getServiceAssociationsByMemberId,
  deleteAssociation,
};
