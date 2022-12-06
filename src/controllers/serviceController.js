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

export { createService, getAllServices };
