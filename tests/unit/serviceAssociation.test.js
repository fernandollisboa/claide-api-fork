/* eslint-disable no-undef */
import { jest } from "@jest/globals";
import { faker } from "@faker-js/faker";
import * as serviceAssociationService from "../../src/services/serviceAssociationService";
import * as serviceAssociationRepository from "../../src/repositories/serviceAssociationRepository";

import {
  createValidServiceAssociation,
  createValidServiceAssociationWithId,
} from "../factories/serviceAssociationFactory";
import ServiceNotFoundError from "../../src/errors/ServiceNotFoundError";
import MemberNotFoundError from "../../src/errors/MemberNotFoundError";
import ServiceAssociationConflictError from "../../src/errors/ServiceAssociationConflictError";

describe("serviceAssociation service", () => {
  describe("create serviceAssociation function", () => {
    describe("given the service data and member date are valid", () => {
      it("should create a new serviceAssociation", async () => {
        const validServiceAssociation = createValidServiceAssociation();

        jest
          .spyOn(serviceAssociationRepository, "insertServiceAssociation")
          .mockImplementationOnce(() => {
            return [{ id: faker.datatype.uuid(), ...validServiceAssociation }];
          });
        const result = serviceAssociationService.createServiceAssociation(validServiceAssociation);
        expect(result).resolves.toMatchObject([validServiceAssociation]);
      });
    });
    describe("given the service doesn't exist", () => {
      it("should throw an error", async () => {
        expect.assertions(3);
        const invalidServiceId = faker.datatype.uuid();
        const validMemberId = faker.datatype.uuid();

        jest
          .spyOn(serviceAssociationRepository, "insertServiceAssociation")
          .mockRejectedValueOnce(
            new Error("some message: `ServiceAssociation_serviceId_fkey (index)`")
          );

        const result = serviceAssociationService.createServiceAssociation({
          serviceId: invalidServiceId,
          memberId: validMemberId,
        });

        expect(result).rejects.toHaveProperty(
          "message",
          `Service with Id: ${invalidServiceId} not found`
        );
        expect(result).rejects.toThrow(new ServiceNotFoundError("Id", invalidServiceId));
        expect(result).rejects.toEqual(new ServiceNotFoundError("Id", invalidServiceId));
      });
    });
    describe("given the member doesn't exist", () => {
      it("should throw an error", async () => {
        expect.assertions(3);
        const validServiceId = faker.datatype.uuid();
        const invalidMemberId = faker.datatype.uuid();

        jest
          .spyOn(serviceAssociationRepository, "insertServiceAssociation")
          .mockRejectedValueOnce(
            new Error("some message: `ServiceAssociation_memberId_fkey (index)`")
          );

        const result = serviceAssociationService.createServiceAssociation({
          serviceId: validServiceId,
          memberId: invalidMemberId,
        });

        expect(result).rejects.toHaveProperty(
          "message",
          `Member with Id: ${invalidMemberId} not found`
        );
        expect(result).rejects.toThrow(new MemberNotFoundError("Id", invalidMemberId));
        expect(result).rejects.toEqual(new MemberNotFoundError("Id", invalidMemberId));
      });
    });
    describe("given the association between these member and service already exists", () => {
      it("should throw an error", async () => {
        expect.assertions(3);
        const invalidServiceId = faker.datatype.uuid();
        const invalidMemberId = faker.datatype.uuid();

        jest
          .spyOn(serviceAssociationRepository, "insertServiceAssociation")
          .mockRejectedValueOnce(new Error());

        const result = serviceAssociationService.createServiceAssociation({
          memberId: invalidMemberId,
          serviceId: invalidServiceId,
        });

        expect(result).rejects.toHaveProperty(
          "message",
          `ServiceAssociation with this ServiceId and Member Id: "serviceId: ${invalidServiceId}, memberId: ${invalidMemberId}" already registered, duplicate data`
        );
        expect(result).rejects.toThrow(
          new ServiceAssociationConflictError(
            "this ServiceId and Member Id",
            `serviceId: ${invalidServiceId}, memberId: ${invalidMemberId}`
          )
        );
        expect(result).rejects.toEqual(
          new ServiceAssociationConflictError(
            "this ServiceId and Member Id",
            `serviceId: ${invalidServiceId}, memberId: ${invalidMemberId}`
          )
        );
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
          .spyOn(serviceAssociationRepository, "getAllAssociations")
          .mockImplementationOnce(() => [
            validServiceAssociationWithId,
            validServiceAssociationWithId2,
          ]);

        const result = await serviceAssociationService.getAllServicesAssociations();

        expect(serviceAssociationRepository.getAllAssociations).toBeCalledTimes(1);
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
      const serviceAssociationGeneratedId3 = faker.datatype.uuid();
      const validServiceAssociationWithId = createValidServiceAssociationWithId({
        id: serviceAssociationGeneratedId,
        serviceId: serviceGeneratedId,
      });
      const validServiceAssociationWithId2 = createValidServiceAssociationWithId({
        id: serviceAssociationGeneratedId2,
      });
      const validServiceAssociationWithId3 = createValidServiceAssociationWithId({
        id: serviceAssociationGeneratedId3,
        serviceId: serviceGeneratedId,
      });
      jest
        .spyOn(serviceAssociationRepository, "getAllAssociationsByServiceId")
        .mockImplementationOnce(() => [
          validServiceAssociationWithId,
          validServiceAssociationWithId3,
        ]);

      const result = await serviceAssociationService.getServiceAssociationsByServiceId(
        serviceGeneratedId
      );

      expect(serviceAssociationRepository.getAllAssociationsByServiceId).toBeCalledTimes(1);
      expect(result).toEqual([validServiceAssociationWithId, validServiceAssociationWithId3]);
    });
  });
});
