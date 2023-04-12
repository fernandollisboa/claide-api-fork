/* eslint-disable no-undef */
import { jest } from "@jest/globals";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import "../../src/setup";
import * as projectAssociationService from "../../src/services/projectAssociationService";
import * as projectAssociationRepository from "../../src/repositories/projectAssociationRepository";
import * as projectAssociationFactory from "../factories/projectAssociationFactory";
import * as memberRepository from "../../src/repositories/memberRepository";
import * as projectService from "../../src/services/projectService";
import * as projectFactory from "../factories/projectFactory";
import ProjectAssociationDateError from "../../src/errors/ProjectAssociationDateError";
import ProjectAssociationNotFoundError from "../../src/errors/ProjectAssociationNotFoundError";
import { createValidMemberWithId, setRegistrationStatus } from "../factories/memberFactory";
import * as authService from "../../src/services/authService";
import * as activityRecordService from "../../src/services/activityRecordService";
import * as memberService from "../../src/services/memberService";

describe("project association service", () => {
  describe("createProjectAssociation function", () => {
    describe("given the Association data is valid", () => {
      it("should create a new project association", async () => {
        expect.assertions(7);

        const memberId = faker.datatype.number({ min: 1 });
        const memberNew = createValidMemberWithId({ id: memberId });
        const member = setRegistrationStatus(memberNew, "APPROVED", "test.test");

        const projectId = faker.datatype.number({ min: 1 });
        const project = projectFactory.createValidProjectWithId({
          id: projectId,
          creationDate: new Date(dayjs(faker.date.past(1, "2010-01-01T00:00:00.000Z"))),
          endDate: new Date(dayjs(faker.date.future(1, "2030-01-01T00:00:00.000Z"))),
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

        jest.spyOn(memberService, "activateMember").mockImplementation(() => {
          return member;
        });

        jest.spyOn(projectService, "findProjectById").mockImplementationOnce(() => {
          return project;
        });
        jest.spyOn(authService, "getUsername").mockImplementation(() => {
          return "test.test";
        });

        jest.spyOn(authService, "getRole").mockImplementation(() => {
          return "SUPPORT";
        });

        jest.spyOn(activityRecordService, "createActivity").mockImplementationOnce(() => {
          return [
            {
              id: faker.datatype.number(),
              operation: "CREATE",
              entity: "PROJECT_ASSOCIATION",
              newValue: validProjectAssociation,
              idEntity: validProjectAssociation.id,
              user: "test.test",
              date: new Date(),
            },
          ];
        });

        const result = projectAssociationService.createProjectAssociation(
          {
            projectId,
            memberId,
            startDate: validProjectAssociation.startDate,
            endDate: validProjectAssociation.endDate,
          },
          "testToken"
        );

        await expect(projectService.findProjectById).toBeCalledTimes(1);
        await expect(projectService.findProjectById).toBeCalledWith(project.id);

        await expect(memberService.activateMember).toBeCalledTimes(1);
        await expect(memberService.activateMember).toBeCalledWith(member.id);

        await expect(projectAssociationRepository.insertProjectAssociation).toBeCalledTimes(1);
        expect(projectAssociationRepository.insertProjectAssociation).toBeCalledWith(
          validProjectAssociation
        );

        expect(result).resolves.toMatchObject(validProjectAssociation);
      });
    });

    describe("given an invalid startDate", () => {
      it("should not allow the criation of the association with stardate before than the project stardate", async () => {
        expect.assertions(3);

        const memberId = faker.datatype.number({ min: 1 });
        const memberNew = createValidMemberWithId({ id: memberId });
        const member = setRegistrationStatus(memberNew, "APPROVED", "test.test");

        const projectId = faker.datatype.number({ min: 1 });
        const project = projectFactory.createValidProjectWithId({
          id: projectId,
          creationDate: new Date(dayjs(faker.date.past(1, "2010-01-01T00:00:00.000Z"))),
          endDate: new Date(dayjs(faker.date.future(1, "2030-01-01T00:00:00.000Z"))),
        });

        const validProjectAssociation = projectAssociationFactory.createValidProjectAssociation({
          projectId,
          memberId,
          startDate: new Date(dayjs(faker.date.past(1, "2005-01-01T00:00:00.000Z"))),
        });

        jest.spyOn(memberRepository, "getMemberById").mockResolvedValue(() => {
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
        expect(projectService.findProjectById).toBeCalledWith(project.id);
        expect(result).rejects.toEqual(new ProjectAssociationDateError());
      });
    });

    describe("given an invalid endDate", () => {
      it("should not allow the criation of the association with endDate after than the project endDate", async () => {
        expect.assertions(3);

        const memberId = faker.datatype.number({ min: 1 });

        const projectId = faker.datatype.number({ min: 1 });
        const project = projectFactory.createValidProjectWithId({
          id: projectId,
          creationDate: new Date(dayjs(faker.date.past(1, "2010-01-01T00:00:00.000Z"))),
          endDate: new Date(dayjs(faker.date.future(1, "2030-01-01T00:00:00.000Z"))),
        });

        const validProjectAssociation = projectAssociationFactory.createValidProjectAssociation({
          projectId,
          memberId,
          endDate: new Date(dayjs(faker.date.future(1, "2031-01-01T00:00:00.000Z"))),
        });

        jest.spyOn(projectService, "findProjectById").mockImplementationOnce(() => {
          return project;
        });

        jest.spyOn(memberRepository, "getMemberById").mockResolvedValue(() => {
          return member;
        });

        const result = projectAssociationService.createProjectAssociation({
          projectId,
          memberId,
          startDate: validProjectAssociation.startDate,
          endDate: validProjectAssociation.endDate,
        });

        await expect(projectService.findProjectById).toBeCalledTimes(1);
        expect(projectService.findProjectById).toBeCalledWith(project.id);
        expect(result).rejects.toEqual(new ProjectAssociationDateError());
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

  describe("updateProjectAssociation function", () => {
    describe("given projectAssociation valid data", () => {
      it("should allow the edition", async () => {
        expect.assertions(7);

        const memberId = faker.datatype.number({ min: 1 });

        const projectId = faker.datatype.number({ min: 1 });
        const project = projectFactory.createValidProjectWithId({
          id: projectId,
          creationDate: new Date(dayjs(faker.date.past(1, "2010-01-01T00:00:00.000Z"))),
          endDate: new Date(dayjs(faker.date.future(1, "2030-01-01T00:00:00.000Z"))),
        });

        const validProjectAssociation = projectAssociationFactory.createValidProjectAssociation({
          projectId,
          memberId,
        });

        jest
          .spyOn(projectAssociationRepository, "findByProjectIdAndMemberId")
          .mockImplementationOnce(() => {
            return validProjectAssociation;
          });

        jest.spyOn(projectService, "findProjectById").mockImplementationOnce(() => {
          return project;
        });

        const newStartDate = new Date(dayjs(faker.date.past(1, "2015-01-01T00:00:00.000Z")));

        jest.spyOn(projectAssociationRepository, "updateAssociation").mockImplementationOnce(() => {
          return { ...validProjectAssociation, startDate: newStartDate };
        });
        jest.spyOn(authService, "getUsername").mockImplementationOnce(() => {
          return "test.test";
        });
        jest.spyOn(activityRecordService, "createActivity").mockImplementationOnce(() => {
          return [
            {
              id: faker.datatype.number(),
              operation: "CREATE",
              entity: "PROJECT_ASSOCIATION",
              oldValue: validProjectAssociation,
              newValue: { ...validProjectAssociation, startDate: newStartDate },
              idEntity: validProjectAssociation.id,
              user: "test.test",
              date: new Date(),
            },
          ];
        });

        const result = projectAssociationService.updateProjectAssociation(
          {
            projectId,
            memberId,
            startDate: newStartDate,
          },
          "testeToken"
        );

        await expect(projectAssociationRepository.findByProjectIdAndMemberId).toBeCalledTimes(1);
        await expect(projectAssociationRepository.findByProjectIdAndMemberId).toBeCalledWith(
          projectId,
          memberId
        );

        await expect(projectService.findProjectById).toBeCalledTimes(1);
        await expect(projectService.findProjectById).toBeCalledWith(project.id);

        await expect(projectAssociationRepository.updateAssociation).toBeCalledTimes(1);
        await expect(projectAssociationRepository.updateAssociation).toBeCalledWith({
          ...validProjectAssociation,
          startDate: newStartDate,
          endDate: undefined,
          isActive: true,
        });
        expect(result).resolves.toMatchObject({
          ...validProjectAssociation,
          startDate: newStartDate,
        });
      });
    });

    describe("given an invalid startDate", () => {
      it("should not allow the edition of the association with stardate before than the project stardate", async () => {
        expect.assertions(5);

        const memberId = faker.datatype.number({ min: 1 });

        const projectId = faker.datatype.number({ min: 1 });
        const project = projectFactory.createValidProjectWithId({
          id: projectId,
          creationDate: new Date(dayjs(faker.date.past(1, "2010-01-01T00:00:00.000Z"))),
          endDate: new Date(dayjs(faker.date.future(1, "2030-01-01T00:00:00.000Z"))),
        });

        const validProjectAssociation = projectAssociationFactory.createValidProjectAssociation({
          projectId,
          memberId,
        });

        jest
          .spyOn(projectAssociationRepository, "findByProjectIdAndMemberId")
          .mockImplementationOnce(() => {
            return validProjectAssociation;
          });

        jest.spyOn(projectService, "findProjectById").mockImplementationOnce(() => {
          return project;
        });

        const newStartDate = new Date(dayjs(faker.date.past(1, "2005-01-01T00:00:00.000Z")));

        const result = projectAssociationService.updateProjectAssociation({
          projectId,
          memberId,
          startDate: newStartDate,
        });

        await expect(projectAssociationRepository.findByProjectIdAndMemberId).toBeCalledTimes(1);
        await expect(projectAssociationRepository.findByProjectIdAndMemberId).toBeCalledWith(
          projectId,
          memberId
        );

        await expect(projectService.findProjectById).toBeCalledTimes(1);
        await expect(projectService.findProjectById).toBeCalledWith(project.id);

        expect(result).rejects.toEqual(new ProjectAssociationDateError());
      });
    });

    describe("given an invalid endDate", () => {
      it("should not allow the edition of the association with endDate after than the project endDate", async () => {
        expect.assertions(5);

        const memberId = faker.datatype.number({ min: 1 });

        const projectId = faker.datatype.number({ min: 1 });
        const project = projectFactory.createValidProjectWithId({
          id: projectId,
          creationDate: new Date(dayjs(faker.date.past(1, "2010-01-01T00:00:00.000Z"))),
          endDate: new Date(dayjs(faker.date.future(1, "2030-01-01T00:00:00.000Z"))),
        });

        const validProjectAssociation = projectAssociationFactory.createValidProjectAssociation({
          projectId,
          memberId,
        });

        jest
          .spyOn(projectAssociationRepository, "findByProjectIdAndMemberId")
          .mockImplementationOnce(() => {
            return validProjectAssociation;
          });

        jest.spyOn(projectService, "findProjectById").mockImplementationOnce(() => {
          return project;
        });

        const newEndDate = new Date(dayjs(faker.date.future(1, "2032-01-01T00:00:00.000Z")));

        const result = projectAssociationService.updateProjectAssociation({
          projectId,
          memberId,
          endDate: newEndDate,
        });

        await expect(projectAssociationRepository.findByProjectIdAndMemberId).toBeCalledTimes(1);
        await expect(projectAssociationRepository.findByProjectIdAndMemberId).toBeCalledWith(
          projectId,
          memberId
        );

        await expect(projectService.findProjectById).toBeCalledTimes(1);
        await expect(projectService.findProjectById).toBeCalledWith(project.id);

        expect(result).rejects.toEqual(new ProjectAssociationDateError());
      });
    });

    describe("given an invalid startDate", () => {
      it("should not allow the edition of the association with startDate before than the endDate", async () => {
        expect.assertions(5);

        const memberId = faker.datatype.number({ min: 1 });

        const projectId = faker.datatype.number({ min: 1 });
        const project = projectFactory.createValidProjectWithId({
          id: projectId,
          creationDate: new Date(dayjs(faker.date.past(1, "2010-01-01T00:00:00.000Z"))),
          endDate: new Date(dayjs(faker.date.future(1, "2030-01-01T00:00:00.000Z"))),
        });

        const validProjectAssociation = projectAssociationFactory.createValidProjectAssociation({
          projectId,
          memberId,
        });

        jest
          .spyOn(projectAssociationRepository, "findByProjectIdAndMemberId")
          .mockImplementationOnce(() => {
            return validProjectAssociation;
          });

        jest.spyOn(projectService, "findProjectById").mockImplementationOnce(() => {
          return project;
        });

        const newStartDate = new Date(dayjs(faker.date.future(1, "2035-01-01T00:00:00.000Z")));

        const result = projectAssociationService.updateProjectAssociation({
          projectId,
          memberId,
          startDate: newStartDate,
        });

        await expect(projectAssociationRepository.findByProjectIdAndMemberId).toBeCalledTimes(1);
        await expect(projectAssociationRepository.findByProjectIdAndMemberId).toBeCalledWith(
          projectId,
          memberId
        );

        await expect(projectService.findProjectById).toBeCalledTimes(1);
        await expect(projectService.findProjectById).toBeCalledWith(project.id);

        expect(result).rejects.toEqual(
          new ProjectAssociationDateError(
            "the project association startDate must be before than the endDate"
          )
        );
      });
    });

    describe("given an invalid endDate", () => {
      it("should not allow the edition of the association with endDate after than the startDate", async () => {
        expect.assertions(5);

        const memberId = faker.datatype.number({ min: 1 });

        const projectId = faker.datatype.number({ min: 1 });
        const project = projectFactory.createValidProjectWithId({
          id: projectId,
          creationDate: new Date(dayjs(faker.date.past(1, "2010-01-01T00:00:00.000Z"))),
          endDate: new Date(dayjs(faker.date.future(1, "2030-01-01T00:00:00.000Z"))),
        });

        const validProjectAssociation = projectAssociationFactory.createValidProjectAssociation({
          projectId,
          memberId,
        });

        jest
          .spyOn(projectAssociationRepository, "findByProjectIdAndMemberId")
          .mockImplementationOnce(() => {
            return validProjectAssociation;
          });

        jest.spyOn(projectService, "findProjectById").mockImplementationOnce(() => {
          return project;
        });

        const newEndDate = new Date(dayjs(faker.date.past(1, "2000-01-01T00:00:00.000Z")));

        const result = projectAssociationService.updateProjectAssociation({
          projectId,
          memberId,
          endDate: newEndDate,
        });

        await expect(projectAssociationRepository.findByProjectIdAndMemberId).toBeCalledTimes(1);
        await expect(projectAssociationRepository.findByProjectIdAndMemberId).toBeCalledWith(
          projectId,
          memberId
        );

        await expect(projectService.findProjectById).toBeCalledTimes(1);
        await expect(projectService.findProjectById).toBeCalledWith(project.id);

        expect(result).rejects.toEqual(
          new ProjectAssociationDateError(
            "the project association startDate must be before than the endDate"
          )
        );
      });
    });

    describe("updating an association that doesn't exists", () => {
      it("should not allow the edition of an association that doesnt exists", async () => {
        expect.assertions(3);

        const memberId = faker.datatype.number({ min: 1 });

        const projectId = faker.datatype.number({ min: 1 });

        jest
          .spyOn(projectAssociationRepository, "findByProjectIdAndMemberId")
          .mockImplementationOnce(() => {
            return undefined;
          });

        const newEndDate = new Date(dayjs(faker.date.future(1, "2032-01-01T00:00:00.000Z")));

        const result = projectAssociationService.updateProjectAssociation({
          projectId,
          memberId,
          endDate: newEndDate,
        });

        await expect(projectAssociationRepository.findByProjectIdAndMemberId).toBeCalledTimes(1);
        await expect(projectAssociationRepository.findByProjectIdAndMemberId).toBeCalledWith(
          projectId,
          memberId
        );
        expect(result).rejects.toEqual(
          new ProjectAssociationNotFoundError("projectId and memberId", [projectId, memberId])
        );
      });
    });
  });
});
