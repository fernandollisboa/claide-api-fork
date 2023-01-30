/* eslint-disable no-undef */
import { jest } from "@jest/globals";
import { faker } from "@faker-js/faker";

import * as servicesService from "../../src/services/serviceService";
import * as serviceRepository from "../../src/repositories/serviceRepository";
import * as serviceAssociationService from "../../src/services/serviceAssociationService";
import ServiceConflictError from "../../src/errors/ServiceConflictError";
import ServiceNotFoundError from "../../src/errors/ServiceNotFoundError";
import { createValidService, createValidServiceWithId } from "../factories/serviceFactory";
import {
  createValidServiceAssociation,
  createValidServiceAssociationWithId,
} from "../factories/serviceAssociationFactory";
import * as authService from "../../src/services/authService";
import * as activityRecordService from "../../src/services/activityRecordService";

describe("services service", () => {
  describe("create service function", () => {
    describe("given the service data is valid", () => {
      it("should create a new service", async () => {
        const validService = createValidService();

        jest.spyOn(serviceRepository, "insertService").mockImplementationOnce(() => {
          return [{ id: faker.datatype.uuid(), ...validService }];
        });
        jest.spyOn(authService, "getUsername").mockImplementationOnce(() => {
          return "test.test";
        });
        jest.spyOn(activityRecordService, "createActivity").mockImplementationOnce(() => {
          return [
            {
              id: faker.datatype.number(),
              operation: "CREATE",
              entity: "SERVICE",
              newValue: validService,
              idEntity: validService.id,
              user: "test.test",
              date: new Date(),
            },
          ];
        });

        const result = servicesService.createService(validService, "validToken");
        expect(result).resolves.toMatchObject([validService]);
      });
    });
    describe("given the service's name is already taken", () => {
      it("should not allow to create a duplicate", async () => {
        expect.assertions(3);
        const duplicateService = createValidServiceWithId({ name: "GitHub" });

        jest.spyOn(serviceRepository, "insertService").mockRejectedValueOnce(new Error());
        const result = servicesService.createService(duplicateService);

        expect(result).rejects.toHaveProperty(
          "message",
          'Service with name: "GitHub" already registered, duplicate data'
        );
        expect(result).rejects.toThrow(new ServiceConflictError("name", "GitHub"));
        expect(result).rejects.toEqual(new ServiceConflictError("name", "GitHub"));
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
        jest.spyOn(authService, "getUsername").mockImplementationOnce(() => {
          return "test.test";
        });
        jest.spyOn(activityRecordService, "createActivity").mockImplementationOnce(() => {
          return [
            {
              id: faker.datatype.number(),
              operation: "UPDATE",
              entity: "SERVICE",
              newValue: newService,
              idEntity: newService.id,
              user: "test.test",
              date: new Date(),
            },
          ];
        });
        const result = servicesService.updateService(newService, "validToken");

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
          `Service with name: "${existingService.name}" already registered, duplicate data`
        );
        expect(result).rejects.toThrow(new ServiceConflictError("name", existingService.name));
        expect(result).rejects.toEqual(new ServiceConflictError("name", existingService.name));
      });
    });
  });
  describe("create serviceAssociation function", () => {
    describe("given the service data and member date are valid", () => {
      it("should create a new serviceAssociation", async () => {
        const validServiceAssociation = createValidServiceAssociation();

        jest
          .spyOn(serviceAssociationService, "createServiceAssociation")
          .mockImplementationOnce(() => {
            return [{ id: faker.datatype.uuid(), ...validServiceAssociation }];
          });
        jest.spyOn(authService, "getUsername").mockImplementationOnce(() => {
          return "test.test";
        });
        jest.spyOn(activityRecordService, "createActivity").mockImplementationOnce(() => {
          return [
            {
              id: faker.datatype.number(),
              operation: "CREATE",
              entity: "SERVICE_ASSOCIATION",
              newValue: validServiceAssociation,
              idEntity: validServiceAssociation.id,
              user: "test.test",
              date: new Date(),
            },
          ];
        });
        const result = servicesService.createServiceAssociation(
          validServiceAssociation,
          "validToken"
        );
        expect(result).resolves.toMatchObject([validServiceAssociation]);
      });
    });
  });
  describe("getAllServicesAssociations function", () => {
    describe("given the method is called", () => {
      it("should return all service's associations registered", async () => {
        expect.assertions(2);
        const serviceAssociationGeneratedId = faker.datatype.uuid();
        const serviceAssociationGeneratedId2 = faker.datatype.uuid();
        const validServiceAssociationWithId = createValidServiceAssociationWithId({
          id: serviceAssociationGeneratedId,
        });
        const validServiceAssociationWithId2 = createValidServiceAssociationWithId({
          id: serviceAssociationGeneratedId2,
        });

        jest
          .spyOn(serviceAssociationService, "getAllServicesAssociations")
          .mockImplementationOnce(() => [
            validServiceAssociationWithId,
            validServiceAssociationWithId2,
          ]);

        const result = await servicesService.getAllServicesAssociations();

        expect(serviceAssociationService.getAllServicesAssociations).toBeCalledTimes(1);
        expect(result).toEqual([validServiceAssociationWithId, validServiceAssociationWithId2]);
      });
    });
  });
  describe("getServiceAssociationsByServiceId function", () => {
    it("should return all associations that involves this serviceId", async () => {
      expect.assertions(2);
      const serviceGeneratedId = faker.datatype.uuid();
      const serviceAssociationGeneratedId = faker.datatype.uuid();
      const serviceAssociationGeneratedId2 = faker.datatype.uuid();
      const validServiceAssociationWithId = createValidServiceAssociationWithId({
        id: serviceAssociationGeneratedId,
        serviceId: serviceGeneratedId,
      });
      const validServiceAssociationWithId2 = createValidServiceAssociationWithId({
        id: serviceAssociationGeneratedId2,
        serviceId: serviceGeneratedId,
      });
      jest
        .spyOn(serviceRepository, "findServiceById")
        .mockResolvedValueOnce(createValidServiceWithId({ id: serviceGeneratedId }));
      jest
        .spyOn(serviceAssociationService, "getServiceAssociationsByServiceId")
        .mockImplementationOnce(() => [
          validServiceAssociationWithId,
          validServiceAssociationWithId2,
        ]);

      const result = await servicesService.getServiceAssociationsByServiceId(serviceGeneratedId);

      expect(serviceAssociationService.getServiceAssociationsByServiceId).toBeCalledTimes(1);
      expect(result).toEqual([validServiceAssociationWithId, validServiceAssociationWithId2]);
    });
  });
});
