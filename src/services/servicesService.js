import * as serviceRepository from "../repositories/serviceRepository.js";

async function createService(serviceData) {
  const { name } = serviceData;
  try {
    const newService = await serviceRepository.insertService({ name });
    return newService;
  } catch (err) {
    throw new Error(`Already exists a service with this name`);
  }
}

async function getAllServices() {
  return await serviceRepository.getAllServices();
}
export { createService, getAllServices };
