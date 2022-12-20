import * as servicesService from "../services/servicesService.js";
import InvalidParamError from "../errors/invalidParamError.js";

async function createService(req, res, next) {
  const { body } = req;
  try {
    const newService = await servicesService.createService(body);
    return res.status(201).send(newService);
  } catch (err) {
    next(err);
  }
}

async function getAllServices(req, res, next) {
  const { name: serviceName } = req.query;

  try {
    if (serviceName) {
      if (typeof serviceName !== "string") throw new InvalidParamError("serviceName", serviceName);
      const service = await servicesService.getServiceByName(serviceName);

      return res.status(200).send(service);
    }
    const services = await servicesService.getAllServices();
    return res.status(200).send(services);
  } catch (err) {
    next(err);
  }
}

async function getServiceById(req, res, next) {
  const id = Number(req.params.serviceId);
  try {
    if (isNaN(id)) throw new InvalidParamError("ServiceId", id);
    const service = await servicesService.getServiceById(id);

    return res.status(200).send(service);
  } catch (err) {
    next(err);
  }
}

async function updateService(req, res, next) {
  const id = Number(req.params.serviceId);
  const { body } = req;

  try {
    if (isNaN(id)) throw new InvalidParamError("serviceId", id);
    const newService = { id, ...body };

    const service = await servicesService.updateService(newService);
    return res.status(200).send(service);
  } catch (err) {
    next(err);
  }
}

async function createServiceAssociation(req, res, next) {
  const serviceId = parseInt(req.params.serviceId);
  const { body } = req;

  try {
    if (isNaN(serviceId)) new InvalidParamError("ServiceId", serviceId);

    const association = {
      ...body,
      serviceId,
    };
    const serviceAssociation = await servicesService.createServiceAssociation(association);
    return res.status(201).send(serviceAssociation);
  } catch (err) {
    next(err);
  }
}

async function getAllServicesAssociations(req, res, next) {
  try {
    const associations = await servicesService.getAllServicesAssociations();
    return res.status(200).send(associations);
  } catch (err) {
    next(err);
  }
}

async function getServiceAssociationByServiceId(req, res, next) {
  const serviceId = Number(req.params.serviceId);
  if (isNaN(serviceId)) throw new InvalidParamError("ServiceId", serviceId);
  try {
    const associationsForService = await servicesService.getServiceAssociationsByServiceId(
      serviceId
    );
    return res.status(200).send(associationsForService);
  } catch (err) {
    next(err);
  }
}

async function getServiceAssociationByMemberId(req, res, next) {
  const memberId = Number(req.params.memberId);
  if (isNaN(memberId)) throw new InvalidParamError("MemberId", memberId);
  try {
    const associationsForMember = await servicesService.getServiceAssociationsByMemberId(memberId);
    return res.status(200).send(associationsForMember);
  } catch (err) {
    next(err);
  }
}

async function deleteAssociation(req, res) {
  const deletedAssociation = await servicesService.deleteAssociation();
  return res.status(200).send(deletedAssociation);
}

export {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  createServiceAssociation,
  getAllServicesAssociations,
  getServiceAssociationByServiceId,
  getServiceAssociationByMemberId,
  deleteAssociation,
};
