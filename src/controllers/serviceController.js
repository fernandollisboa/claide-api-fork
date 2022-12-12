import * as serviceSchema from "../schemas/serviceSchema";
import * as servicesService from "../services/servicesService.js";

async function createService(req, res) {
  const { body } = req;
  const joiValidation = serviceSchema.createServiceSchema.validate(body);

  if (joiValidation.error) {
    const typeError = joiValidation.error.details[0].type;
    if (typeError === "any.required" || typeError === "object.unknown") {
      return res.status(400).send(joiValidation.error.details[0].message);
    }
    return res.status(422).send(joiValidation.error.details[0].message);
  }
  try {
    const newService = await servicesService.createService(body);
    return res.status(201).send(newService);
  } catch (err) {
    return res.status(409).send(err.message);
  }
}

async function getAllServices(req, res) {
  const services = await servicesService.getAllServices();
  return res.status(200).send(services);
}

async function getServiceById(req, res) {
  const id = parseInt(req.params.serviceId);
  if (isNaN(id)) {
    return res.status(400).send("The service's Id parameter must be a number");
  }
  try {
    const service = await servicesService.getServiceById(id);

    return res.status(200).send(service);
  } catch (err) {
    return res.status(404).send(err.message);
  }
}

async function getServiceByName(req, res) {
  const { serviceName } = req.params;
  if (typeof serviceName !== "string") {
    return res.status(400).send("The service's Name parameter must be a string");
  }
  try {
    const service = await servicesService.getServiceByName(serviceName);

    return res.status(200).send(service);
  } catch (err) {
    return res.status(404).send(err.message);
  }
}

async function createServiceAssociation(req, res) {
  const serviceId = parseInt(req.params.serviceId);
  const { body } = req;

  if (isNaN(serviceId)) {
    return res.status(400).send("The service's Id parameter must be a number");
  }

  const association = {
    ...body,
    serviceId,
  };

  const joiValidation = serviceSchema.createServiceAssociationSchema.validate(association);

  if (joiValidation.error) {
    const typeError = joiValidation.error.details[0].type;
    if (typeError === "any.required" || typeError === "object.unknown") {
      return res.status(422).send(joiValidation.error.details[0].message);
    }
    return res.status(409).send(joiValidation.error.details[0].message);
  }

  try {
    const serviceAssociation = await servicesService.createServiceAssociation(association);
    return res.status(201).send(serviceAssociation);
  } catch (err) {
    return res.status(400).send(err.message);
  }
}

async function getAllServicesAssociations(req, res) {
  const associations = await servicesService.getAllServicesAssociations();
  return res.status(200).send(associations);
}

async function getServiceAssociationByServiceId(req, res) {
  const serviceId = parseInt(req.params.serviceId);
  if (isNaN(serviceId)) {
    return res.status(400).send("The service's Id parameter must be a number");
  }
  try {
    const associationsForService = await servicesService.getServiceAssociationsByServiceId(
      serviceId
    );
    return res.status(200).send(associationsForService);
  } catch (err) {
    return res.status(err.statusCode).send(err.message);
  }
}

async function getServiceAssociationByMemberId(req, res) {
  const memberId = parseInt(req.params.memberId);
  if (isNaN(memberId)) {
    return res.status(400).send("The service's Id parameter must be a number");
  }
  try {
    const associationsForMember = await servicesService.getServiceAssociationsByMemberId(memberId);
    return res.status(200).send(associationsForMember);
  } catch (err) {
    return res.status(404).send(err.message);
  }
}

async function deleteAssociation(req, res) {
  // const { id } = parseInt(req.params.id);
  const deletedAssociation = await servicesService.deleteAssociation();
  return res.status(200).send(deletedAssociation);
}

export {
  createService,
  getAllServices,
  getServiceById,
  getServiceByName,
  createServiceAssociation,
  getAllServicesAssociations,
  getServiceAssociationByServiceId,
  getServiceAssociationByMemberId,
  deleteAssociation,
};
