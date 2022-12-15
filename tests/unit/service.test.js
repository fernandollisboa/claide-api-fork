/* eslint-disable no-undef */
import { jest } from "@jest/globals";
import { faker } from "@faker-js/faker";

import * as servicesService from "../../src/services/servicesService";
import * as serviceRepository from "../../src/repositories/serviceRepository";
import ServiceNotFoundError from "../../src/errors/ServiceNotFoundError";
import { createValidService, createValidServiceWithId } from "../factories/serviceFactory";

describe("services service", () => {
  describe("create service function", () => {
    describe("given the service data is valid", () => {
      it("should create a new service", async () => {
        const validService = createValidService();

        jest.spyOn(serviceRepository, "insertService").mockImplementationOnce(() => {
          return [{ id: faker.datatype.uuid(), ...validService }];
        });
        const result = servicesService.createService(validService);
        expect(result).resolves.toMatchObject([validService]);
      });
    });
    describe("given the service's name is already taken", () => {
      it("should not allow to create a duplicate", async () => {
        expect.assertions(3);
        const duplicateService = createValidServiceWithId({ name: "GitHub" });

        jest.spyOn(serviceRepository, "insertService").mockRejectedValueOnce(new Error());
        const result = servicesService.createService(duplicateService);

        expect(result).rejects.toHaveProperty("message", `Already exists a service with this name`);
        expect(result).rejects.toThrow(new Error(`Already exists a service with this name`));
        expect(result).rejects.toEqual(new Error(`Already exists a service with this name`));
      });
    });
  });
  describe("getServiceById function", () => {
    describe("given the service's id is valid", () => {
      it("should return the service's data", async () => {
        expect.assertions(3);
        const serviceGeneratedId = faker.datatype.uuid();
        const validServiceWithId = createValidServiceWithId({ id: serviceGeneratedId });

        jest.spyOn(serviceRepository, "findServiceById").mockImplementationOnce(() => {
          return validServiceWithId;
        });

        const result = await servicesService.getServiceById(serviceGeneratedId);

        expect(serviceRepository.findServiceById).toBeCalledTimes(1);
        expect(serviceRepository.findServiceById).toBeCalledWith(serviceGeneratedId);
        expect(result).toEqual(validServiceWithId);
      });
    });
    describe("given service's id is not found", () => {
      it("should not allow to get an inexistent service", async () => {
        expect.assertions(4);
        const serviceInvalidId = faker.datatype.uuid();

        jest
          .spyOn(serviceRepository, "findServiceById")
          .mockRejectedValueOnce(new ServiceNotFoundError("id", serviceInvalidId));
        const result = servicesService.getServiceById(serviceInvalidId);

        expect(serviceRepository.findServiceById).toBeCalledWith(serviceInvalidId);
        expect(result).rejects.toHaveProperty(
          "message",
          `Service with id: ${serviceInvalidId} not found`
        );
        expect(result).rejects.toEqual(new ServiceNotFoundError("id", serviceInvalidId));
        expect(result).rejects.toMatchObject(new ServiceNotFoundError("id", serviceInvalidId));
      });
    });
  });
  describe("getServiceByName function", () => {
    describe("given the service's name is valid", () => {
      it("should return the service's data", async () => {
        expect.assertions(3);
        const serviceGeneratedId = faker.datatype.uuid();
        const serviceGeneratedName = faker.internet.domainName();
        const validServiceWithId = createValidServiceWithId({
          id: serviceGeneratedId,
          name: serviceGeneratedName,
        });

        jest.spyOn(serviceRepository, "findServiceByName").mockImplementationOnce(() => {
          return validServiceWithId;
        });

        const result = await servicesService.getServiceByName(serviceGeneratedName);

        expect(serviceRepository.findServiceByName).toBeCalledTimes(1);
        expect(serviceRepository.findServiceByName).toBeCalledWith(serviceGeneratedName);
        expect(result).toEqual(validServiceWithId);
      });
    });
    describe("given service's name is not found", () => {
      it("should not allow to get an inexistent service", async () => {
        expect.assertions(4);
        const serviceInvalidName = faker.internet.domainName();

        jest
          .spyOn(serviceRepository, "findServiceByName")
          .mockRejectedValueOnce(new ServiceNotFoundError("name", serviceInvalidName));
        const result = servicesService.getServiceByName(serviceInvalidName);

        expect(result).rejects.toHaveProperty(
          "message",
          `Service with name: ${serviceInvalidName} not found`
        );
        expect(serviceRepository.findServiceByName).toBeCalledWith(serviceInvalidName);
        expect(result).rejects.toEqual(new ServiceNotFoundError("name", serviceInvalidName));
        expect(result).rejects.toMatchObject(new ServiceNotFoundError("name", serviceInvalidName));
      });
    });
  });
  describe("getAllServices function", () => {
    describe("given the getAllServices is called", () => {
      it("should return all services created", async () => {
        expect.assertions(2);
        const serviceGeneratedId = faker.datatype.uuid();
        const serviceGeneratedId2 = faker.datatype.uuid();
        const validServiceWithId = createValidServiceWithId({ id: serviceGeneratedId });
        const validServiceWithId2 = createValidServiceWithId({ id: serviceGeneratedId2 });

        jest
          .spyOn(serviceRepository, "getAllServices")
          .mockImplementationOnce(() => [validServiceWithId, validServiceWithId2]);

        const result = await servicesService.getAllServices();

        expect(serviceRepository.getAllServices).toBeCalledTimes(1);
        expect(result).toEqual([validServiceWithId, validServiceWithId2]);
      });
    });
  });
  describe("updateService function", () => {
    const serviceGeneratedId = faker.datatype.uuid();
    const existingService = createValidServiceWithId({ id: serviceGeneratedId });
    const newService = createValidServiceWithId({ id: serviceGeneratedId });
    describe("given the service's data is valid (not duplicated)", () => {
      it("update should be done and updated ", async () => {
        expect.assertions(3);

        jest.spyOn(serviceRepository, "findServiceById").mockResolvedValueOnce(existingService);
        jest.spyOn(serviceRepository, "updateService").mockImplementationOnce(() => newService);
        const result = servicesService.updateService(newService);

        await expect(result).resolves.toEqual(newService);
        expect(serviceRepository.updateService).toBeCalledTimes(1);
        expect(serviceRepository.updateService).toBeCalledWith(newService);
      });
    });
    describe("given the service's id provided is not found", () => {
      it("should not allow the update", async () => {
        expect.assertions(4);
        const serviceInvalidId = faker.datatype.uuid();
        const validServiceBody = createValidService();

        jest
          .spyOn(serviceRepository, "findServiceById")
          .mockRejectedValueOnce(new ServiceNotFoundError("id", serviceInvalidId));
        const result = servicesService.updateService({
          id: serviceInvalidId,
          name: validServiceBody,
        });

        expect(serviceRepository.findServiceById).toBeCalledWith(serviceInvalidId);
        expect(result).rejects.toHaveProperty(
          "message",
          `Service with id: ${serviceInvalidId} not found`
        );
        expect(result).rejects.toMatchObject(new ServiceNotFoundError("id", serviceInvalidId));
        expect(result).rejects.toEqual(new ServiceNotFoundError("id", serviceInvalidId));
      });
    });
    describe("given the service's data is invalid", () => {
      it("should not allow the update", async () => {
        const duplicateService = createValidServiceWithId({ name: existingService.name });

        jest.spyOn(serviceRepository, "findServiceById").mockResolvedValueOnce(existingService);
        jest.spyOn(serviceRepository, "updateService").mockRejectedValueOnce(new Error());
        const result = servicesService.updateService(duplicateService);

        expect(serviceRepository.findServiceById).toBeCalledWith(duplicateService.id);
        expect(result).rejects.toHaveProperty(
          "message",
          `Already exists a service with this data!`
        );
        expect(result).rejects.toThrow(new Error(`Already exists a service with this data!`));
        expect(result).rejects.toEqual(new Error(`Already exists a service with this data!`));
      });
    });
  });
});
