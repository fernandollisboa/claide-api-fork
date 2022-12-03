import { jest } from "@jest/globals";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";

import * as projectAssociationService from "../../src/services/projectAssociationService";
import * as projectAssociationRepository from "../../src/repositories/projectAssociationRepository";
import * as projectAssociationFactory from "../factories/projectAssociationFactory";
import * as memberRepository from "../../src/repositories/memberRepository";
import * as projectService from "../../src/services/projectService";
import * as projectFactory from "../factories/projectFactory";
import { createValidMember, createValidMemberWithId } from "../factories/memberFactory";

describe("project association service", () => {
  describe("createProjectAssociation function", () => {
    describe("given the Association data is valid", () => {
      it("should create a new project association", async () => {
        expect.assertions(7);

        const memberId = faker.datatype.number({ min: 1 });
        const member = createValidMemberWithId({ id: memberId });

        const projectId = faker.datatype.number({ min: 1 });
        const project = projectFactory.createValidProjectWithId({
          id: projectId,
          creationDate: new Date(
            dayjs(faker.date.past(1, "2010-01-01T00:00:00.000Z")).format("MM/DD/YYYY")
          ),
          endDate: new Date(
            dayjs(faker.date.future(1, "2030-01-01T00:00:00.000Z")).format("MM/DD/YYYY")
          ),
        });

        const validProjectAssociation = projectAssociationFactory.createValidProjectAssociation({
          projectId,
          memberId,
        });

        jest
          .spyOn(projectAssociationRepository, "insertProjectAssociation")
          .mockImplementationOnce(() => {
            return validProjectAssociation;
          });

        jest.spyOn(memberRepository, "activateMember").mockImplementationOnce(() => {
          return member;
        });

        jest.spyOn(projectService, "findProjectById").mockImplementationOnce(() => {
          return project;
        });

        const result = projectAssociationService.createProjectAssociation({
          projectId,
          memberId,
          startDate: validProjectAssociation.startDate,
          endDate: validProjectAssociation.endDate,
        });

        await expect(projectService.findProjectById).toBeCalledTimes(1);
        await expect(projectService.findProjectById).toBeCalledWith(project.id);

        await expect(memberRepository.activateMember).toBeCalledTimes(1);
        await expect(memberRepository.activateMember).toBeCalledWith(member.id);

        await expect(projectAssociationRepository.insertProjectAssociation).toBeCalledTimes(1);
        expect(projectAssociationRepository.insertProjectAssociation).toBeCalledWith(
          validProjectAssociation
        );

        expect(result).resolves.toMatchObject(validProjectAssociation);
      });
    });
  });

  describe("findByProjectId function", () => {
    describe("given the project's id is valid", () => {
      it("should return the project association's data", async () => {
        expect.assertions(3);

        const member1Id = faker.datatype.number({ min: 1 });
        const member2Id = member1Id + 1;

        const projectId = faker.datatype.number({ min: 1 });

        const createValidProjectAssociation1 =
          projectAssociationFactory.createValidProjectAssociation({
            projectId,
            member1Id,
          });

        const createValidProjectAssociation2 =
          projectAssociationFactory.createValidProjectAssociation({
            projectId,
            member2Id,
          });

        jest.spyOn(projectAssociationRepository, "findByProjectId").mockImplementationOnce(() => {
          return [createValidProjectAssociation1, createValidProjectAssociation2];
        });

        const result = projectAssociationService.findByProjectId(projectId);

        expect(projectAssociationRepository.findByProjectId).toBeCalledTimes(1);
        expect(projectAssociationRepository.findByProjectId).toBeCalledWith(projectId);
        expect(result).resolves.toMatchObject([
          createValidProjectAssociation1,
          createValidProjectAssociation2,
        ]);
      });
    });
  });

  describe("findByMemberId function", () => {
    describe("given the findByMemberId is valid", () => {
      it("should return the project association's data", async () => {
        expect.assertions(3);

        const memberId = faker.datatype.number({ min: 1 });

        const project1Id = faker.datatype.number({ min: 1 });
        const project2Id = project1Id + 1;

        const createValidProject1Association =
          projectAssociationFactory.createValidProjectAssociation({
            project1Id,
            memberId: memberId,
          });

        const createValidProject2Association =
          projectAssociationFactory.createValidProjectAssociation({
            project2Id,
            memberId: memberId,
          });

        jest.spyOn(projectAssociationRepository, "findByMemberId").mockImplementationOnce(() => {
          return [createValidProject2Association, createValidProject1Association];
        });

        const result = projectAssociationService.findByMemberId(memberId);

        await expect(projectAssociationRepository.findByMemberId).toBeCalledTimes(1);
        expect(projectAssociationRepository.findByMemberId).toBeCalledWith(memberId);
        expect(result).resolves.toMatchObject([
          createValidProject2Association,
          createValidProject1Association,
        ]);
      });
    });
  });

  describe("findByProjectIdAndMemberId function", () => {
    describe("given the username is valid", () => {
      it("should return the project association's data", async () => {
        expect.assertions(3);

        const member1Id = faker.datatype.number({ min: 1 });
        const project1Id = faker.datatype.number({ min: 1 });

        const validProject1AssociationUser1 =
          projectAssociationFactory.createValidProjectAssociation({
            project1Id,
            member1Id,
          });

        jest
          .spyOn(projectAssociationRepository, "findByProjectIdAndMemberId")
          .mockImplementationOnce(() => {
            return validProject1AssociationUser1;
          });

        const result = projectAssociationService.findByProjectIdAndMemberId(project1Id, member1Id);

        expect(projectAssociationRepository.findByProjectIdAndMemberId).toBeCalledTimes(1);
        expect(projectAssociationRepository.findByProjectIdAndMemberId).toBeCalledWith(
          project1Id,
          member1Id
        );
        expect(result).resolves.toMatchObject(validProject1AssociationUser1);
      });
    });
  });

  //   describe("updateProjectAssociation function", () => {});
});
