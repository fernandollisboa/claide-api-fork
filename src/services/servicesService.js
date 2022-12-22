import * as serviceRepository from "../repositories/serviceRepository.js";
import * as serviceAssociationService from "../services/serviceAssociationService";
import ServiceConflictError from "../errors/ServiceConflictError.js";

async function createService(serviceData) {
  const { name } = serviceData;

  try {
    const newService = await serviceRepository.insertService({ name });
    return newService;
  } catch (err) {
    throw new ServiceConflictError("name", name);
  }
}

async function getAllServices() {
  return await serviceRepository.getAllServices();
}

async function getServiceById(serviceId) {
  const service = await serviceRepository.findServiceById(serviceId);
  return service;
}

async function getServiceByName(serviceName) {
  const service = await serviceRepository.findServiceByName(serviceName);
  return service;
}

async function updateService({ id, name }) {
  const service = await serviceRepository.findServiceById(id);
  if (service) {
    try {
      const updatedService = await serviceRepository.updateService({
        id,
        name: name ? name.trim() : service.name,
      });
      return updatedService;
    } catch (err) {
      throw new ServiceConflictError("name", name);
    }
  }
  return service;
}

async function createServiceAssociation({ memberId, serviceId }) {
  const newServiceAssociation = await serviceAssociationService.createServiceAssociation({
    memberId,
    serviceId,
  });
  return newServiceAssociation;
}

async function getAllServicesAssociations() {
  return await serviceAssociationService.getAllServicesAssociations();
}

async function getServiceAssociationsByServiceId(serviceId) {
  const service = await serviceRepository.findServiceById(serviceId);
  if (service) {
    const result = await serviceAssociationService.getServiceAssociationsByServiceId(serviceId);
    return result;
  }
  return service;
}

async function getServiceAssociationsByMemberId(memberId) {
  return await serviceAssociationService.getServiceAssociationsByMemberId(memberId);
}

export {
  createService,
  getAllServices,
  getServiceById,
  getServiceByName,
  updateService,
  createServiceAssociation,
  getAllServicesAssociations,
  getServiceAssociationsByServiceId,
  getServiceAssociationsByMemberId,
};
