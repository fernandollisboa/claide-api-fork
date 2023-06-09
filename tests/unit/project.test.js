import { describe, it, expect, jest } from "@jest/globals";
import { faker } from "@faker-js/faker";
import "../../src/setup";
import * as projectService from "../../src/services/projectService";
import * as projectRepository from "../../src/repositories/projectRepository";
import * as projectFactory from "../factories/projectFactory";
import * as projectAssociationService from "../../src/services/projectAssociationService";
import ProjectInvalidCreationOrEndDateError from "../../src/errors/ProjectInvalidCreationOrEndDateError";
import ProjectNotFoundError from "../../src/errors/ProjectNotFoundError";
import * as authService from "../../src/services/authService";
import * as activityRecordService from "../../src/services/activityRecordService";
import * as projectAssociationRepository from "../../src/repositories/projectAssociationRepository";
import * as projectAssociationFactory from "../factories/projectAssociationFactory";

describe("project service", () => {
  describe("createProject function", () => {
    describe("given project's data is valid", () => {
      it("should create a new project", async () => {
        expect.assertions(2);
        const validProject = projectFactory.createValidProject();

        jest.spyOn(projectRepository, "findByName").mockResolvedValueOnce(null);
        jest.spyOn(projectRepository, "findByEmbrapiiCode").mockResolvedValueOnce(null);
        jest.spyOn(projectRepository, "insertProject").mockImplementationOnce(() => {
          return [{ ...validProject, id: faker.datatype.number() }];
        });
        jest.spyOn(authService, "getUsername").mockImplementationOnce(() => {
          return "test.test";
        });
        jest.spyOn(activityRecordService, "createActivity").mockImplementationOnce(() => {
          return [
            {
              id: faker.datatype.number(),
              operation: "CREATE",
              entity: "PROJECT",
              newValue: validProject,
              idEntity: validProject.id,
              user: "test.test",
              date: new Date(),
            },
          ];
        });

        const result = projectService.createProject(validProject, "testToken");

        await expect(result).resolves.toMatchObject([validProject]);
        expect(projectRepository.insertProject).toBeCalledTimes(1);
      });
    });

    describe("given project is given only with creationDate", () => {
      it("should only be able to create it if isActive is true", async () => {
        const creationDate = faker.date.past();
        const newProject = projectFactory.createValidProjectWithoutEndDate({
          creationDate,
        });

        jest.spyOn(projectRepository, "insertProject").mockImplementationOnce(() => {
          return [{ ...newProject, id: faker.datatype.number(), isActive: true }];
        });
        jest.spyOn(authService, "getUsername").mockImplementationOnce(() => {
          return "test.test";
        });
        jest.spyOn(activityRecordService, "createActivity").mockImplementationOnce(() => {
          return [
            {
              id: faker.datatype.number(),
              operation: "CREATE",
              entity: "PROJECT",
              newValue: newProject,
              idEntity: newProject.id,
              user: "test.test",
              date: new Date(),
            },
          ];
        });

        const result = projectService.createProject(newProject, "testToken");
        expect(result).resolves.toMatchObject([newProject]);
      });
    });

    describe("given project's endDate is less than today", () => {
      it("should only be able to create it only if isActive is false", async () => {
        const endDate = faker.date.past();
        const creationDate = faker.date.past(1, endDate);

        const finalizedProject = projectFactory.createValidProject({
          creationDate,
          endDate,
        });

        jest.spyOn(projectRepository, "insertProject").mockImplementationOnce(() => {
          return [{ id: faker.datatype.uuid(), isActive: false, ...finalizedProject }];
        });
        jest.spyOn(authService, "getUsername").mockImplementationOnce(() => {
          return "test.test";
        });
        jest.spyOn(activityRecordService, "createActivity").mockImplementationOnce(() => {
          return [
            {
              id: faker.datatype.number(),
              operation: "CREATE",
              entity: "PROJECT",
              newValue: finalizedProject,
              idEntity: finalizedProject.id,
              user: "test.test",
              date: new Date(),
            },
          ];
        });

        const result = projectService.createProject(finalizedProject, "testToken");
        expect(result).resolves.toMatchObject([finalizedProject]);
      });
    });

    describe("given project's endDate is less than creationDate", () => {
      it("should not allow to create the project", async () => {
        expect.assertions(2);

        const endDate = faker.date.future();
        const creationDate = faker.date.future(1, endDate);

        const finalizedProject = projectFactory.createValidProject({
          creationDate: creationDate,
          endDate: endDate,
        });
        jest.spyOn(authService, "getUsername").mockImplementationOnce(() => {
          return "test.test";
        });
        jest.spyOn(activityRecordService, "createActivity").mockImplementationOnce(() => {
          return [
            {
              id: faker.datatype.number(),
              operation: "CREATE",
              entity: "PROJECT",
              newValue: finalizedProject,
              idEntity: finalizedProject.id,
              user: "test.test",
              date: new Date(),
            },
          ];
        });

        const result = projectService.createProject(finalizedProject, "testToken");

        await expect(result).rejects.toThrow(ProjectInvalidCreationOrEndDateError);
        expect(result).rejects.toHaveProperty(
          "message",
          new ProjectInvalidCreationOrEndDateError(creationDate, endDate).message
        );
      });
    });
  });

  describe("getProjectById function", () => {
    describe("given project's id exists on database", () => {
      it("should return project's data", async () => {
        expect.assertions(3);
        const projectId = faker.datatype.number({ min: 1 });

        const validProject = projectFactory.createValidProjectWithId({
          id: projectId,
          isActive: true,
        });

        jest.spyOn(projectRepository, "findById").mockImplementationOnce(() => validProject);

        const result = await projectService.findProjectById(projectId);

        expect(projectRepository.findById).toBeCalledWith(projectId);
        expect(projectRepository.findById).toBeCalledTimes(1);
        expect(result).toEqual(validProject);
      });
    });

    describe("given project's id is not found", () => {
      it("should not allow to get a nonexistent project", async () => {
        expect.assertions(3);
        const nonexistentProjectId = faker.datatype.number();

        jest.spyOn(projectRepository, "findById").mockReturnValueOnce(null);

        const result = projectService.findProjectById(nonexistentProjectId);

        await expect(projectRepository.findById).toBeCalledWith(nonexistentProjectId);
        expect(result).rejects.toThrow(ProjectNotFoundError);
        expect(result).rejects.toHaveProperty(
          "message",
          `Project with id: ${nonexistentProjectId} not found`
        );
      });
    });
  });

  describe("updateProject function", () => {
    const mockCreationDate = faker.date.past();
    const mockEndDate = faker.date.future(1, mockCreationDate);

    const existingProject = projectFactory.createValidProjectWithId({
      id: 10,
      creationDate: mockCreationDate,
      endDate: mockEndDate,
    });
    const updateProjectWrongId = projectFactory.createValidProjectWithId({
      ...existingProject,
      id: 13,
      name: "changed",
    });

    describe("given project's id is not found", () => {
      it("should not allow to update a nonexistent project", async () => {
        expect.assertions(3);

        jest.spyOn(projectRepository, "findById").mockReturnValueOnce(null);

        const result = projectService.updateProject(updateProjectWrongId, "testeToken");

        expect(projectRepository.findById).toBeCalledWith(updateProjectWrongId.id);
        expect(result).rejects.toThrow(ProjectNotFoundError);
        expect(result).rejects.toHaveProperty(
          "message",
          `Project with id: ${updateProjectWrongId.id} not found`
        );
      });
    });

    describe("given update project's endDate is before original creationDate", () => {
      it("should not allow to update the endDate", async () => {
        expect.assertions(3);
        const { creationDate } = existingProject;

        const endDate = faker.date.past(1, creationDate);

        const newProject = projectFactory.createValidProjectWithId({
          ...existingProject,
          endDate,
        });

        jest.spyOn(projectRepository, "findById").mockReturnValueOnce(existingProject);

        const result = projectService.updateProject(newProject, "testeToken");

        await expect(result).rejects.toThrow(ProjectInvalidCreationOrEndDateError);
        expect(projectRepository.findById).toBeCalledWith(newProject.id);
        expect(result).rejects.toHaveProperty(
          "message",
          new ProjectInvalidCreationOrEndDateError(creationDate, endDate).message
        );
      });
    });

    describe("given update project's creationDate is after original endDate", () => {
      it("should not allow to update creationDate", async () => {
        expect.assertions(2);
        const { endDate } = existingProject;
        const creationDate = faker.date.future(1, endDate).toISOString();

        const newProject = projectFactory.createValidProjectWithoutEndDateWithId({
          ...existingProject,
          creationDate,
        });

        jest.spyOn(projectRepository, "findById").mockReturnValueOnce(existingProject);
        jest.spyOn(activityRecordService, "createActivity").mockImplementationOnce(() => {
          return [
            {
              id: faker.datatype.number(),
              operation: "CREATE",
              entity: "PROJECT",
              newValue: newProject,
              oldValue: existingProject,
              idEntity: existingProject.id,
              user: "test.test",
              date: new Date(),
            },
          ];
        });

        const result = projectService.updateProject(newProject, "testToken");

        expect(projectRepository.findById).toBeCalledWith(newProject.id);
        await expect(result).rejects.toThrow(ProjectInvalidCreationOrEndDateError);
      });
    });

    describe("given update project's endDate is before original creationDate", () => {
      it("should not allow to update project's endDate", async () => {
        expect.assertions(3);
        const { creationDate, id } = existingProject;
        const endDate = faker.date.past(1, creationDate).toISOString();

        const newProject = projectFactory.createValidProjectWithoutCreationDateWithId({
          id,
          endDate,
        });

        jest.spyOn(projectRepository, "findById").mockReturnValueOnce(existingProject);
        jest.spyOn(activityRecordService, "createActivity").mockImplementationOnce(() => {
          return [
            {
              id: faker.datatype.number(),
              operation: "CREATE",
              entity: "PROJECT",
              newValue: newProject,
              oldValue: existingProject,
              idEntity: existingProject.id,
              user: "test.test",
              date: new Date(),
            },
          ];
        });

        const result = projectService.updateProject(newProject, "testToken");

        expect(projectRepository.findById).toBeCalledWith(newProject.id);
        await expect(result).rejects.toEqual(
          new ProjectInvalidCreationOrEndDateError(creationDate, endDate)
        );
        expect(result).rejects.toThrow(ProjectInvalidCreationOrEndDateError);
      });
    });

    describe("given valid creationDate and endDates to change isActive atribute", () => {
      it("should update isActive to false and the creationDate and endDates", async () => {
        expect.assertions(4);
        const creationDate = faker.date.past();
        const endDate = faker.date.future();
        const newProject = projectFactory.createValidProjectWithId({
          ...existingProject,
          creationDate,
          endDate,
        });
        const startDate = faker.date.between(creationDate, endDate);
        const endAssociationDate = faker.date.between(startDate, endDate);
        const association = projectAssociationFactory.createValidProjectAssociation({
          startDate: startDate,
          endDate: endAssociationDate,
        });

        jest.spyOn(projectRepository, "findById").mockResolvedValueOnce(existingProject);
        jest
          .spyOn(projectRepository, "updateProject")
          .mockResolvedValueOnce({ ...newProject, isActive: false });
        jest.spyOn(authService, "getUsername").mockImplementationOnce(() => {
          return "test.test";
        });
        jest.spyOn(projectAssociationRepository, "findByProjectId").mockResolvedValue(association);
        jest.spyOn(projectAssociationService, "findByProjectId").mockResolvedValue([association]);
        jest
          .spyOn(projectAssociationService, "updateProjectAssociation")
          .mockResolvedValue(association);

        jest.spyOn(activityRecordService, "createActivity").mockImplementationOnce(() => {
          return [
            {
              id: faker.datatype.number(),
              operation: "CREATE",
              entity: "PROJECT",
              newValue: newProject,
              oldValue: existingProject,
              idEntity: existingProject.id,
              user: "test.test",
              date: new Date(),
            },
          ];
        });

        const result = await projectService.updateProject(newProject, "testToken");
        expect(projectRepository.findById).toBeCalledWith(newProject.id);
        expect(result.isActive).toEqual(false);
        expect(result.creationDate).toEqual(newProject.creationDate);
        expect(result.endDate).toEqual(newProject.endDate);
      });
    });

    describe("given valid end date to change the status of the project", () => {
      it("should update the status to true and the end date", async () => {
        expect.assertions(4);
        const endDate = faker.date.future(5);
        const newProject = projectFactory.createValidProjectWithoutCreationDateWithId({
          ...existingProject,
          endDate,
          creationDate: undefined,
        });

        jest.spyOn(projectRepository, "findById").mockResolvedValueOnce(existingProject);
        jest.spyOn(projectRepository, "updateProject").mockImplementationOnce(() => {
          return { ...newProject, isActive: true, creationDate: existingProject.creationDate };
        });
        jest.spyOn(projectAssociationService, "findByProjectId").mockResolvedValue([]);
        jest.spyOn(projectAssociationService, "updateProjectAssociation").mockResolvedValue(null);
        jest.spyOn(authService, "getUsername").mockImplementationOnce(() => {
          return "test.test";
        });
        jest.spyOn(activityRecordService, "createActivity").mockImplementationOnce(() => {
          return [
            {
              id: faker.datatype.number(),
              operation: "CREATE",
              entity: "PROJECT",
              newValue: newProject,
              oldValue: existingProject,
              idEntity: existingProject.id,
              user: "test.test",
              date: new Date(),
            },
          ];
        });

        const result = await projectService.updateProject(newProject, "testToken");

        expect(projectRepository.findById).toBeCalledWith(newProject.id);
        expect(result.isActive).toEqual(true);
        expect(result.creationDate).toEqual(existingProject.creationDate);
        expect(result.endDate).toEqual(newProject.endDate);
      });
    });
    describe("given valid attributes to update a project", () => {
      it("should update project with new attributes", async () => {
        expect.assertions(4);
        const newProject = projectFactory.createValidProjectWithId({
          ...existingProject,
          name: "Update Name",
          room: "Update Room",
          building: "Update Building",
        });
        jest.spyOn(projectRepository, "findById").mockResolvedValueOnce(existingProject);
        jest.spyOn(projectRepository, "updateProject").mockImplementationOnce(() => {
          return newProject;
        });
        jest.spyOn(projectAssociationService, "findByProjectId").mockResolvedValue([]);
        jest.spyOn(projectAssociationService, "updateProjectAssociation").mockResolvedValue(null);

        jest.spyOn(authService, "getUsername").mockImplementationOnce(() => {
          return "test.test";
        });
        jest.spyOn(activityRecordService, "createActivity").mockImplementationOnce(() => {
          return [
            {
              id: faker.datatype.number(),
              operation: "CREATE",
              entity: "PROJECT",
              newValue: newProject,
              oldValue: existingProject,
              idEntity: existingProject.id,
              user: "test.test",
              date: new Date(),
            },
          ];
        });
        jest
          .spyOn(projectAssociationService, "updateProjectAssociation")
          .mockImplementationOnce(() => {
            return { memberId: 1, projectId: 2 };
          });

        const result = await projectService.updateProject(newProject, "testToken");
        expect(projectRepository.findById).toBeCalledWith(newProject.id);
        expect(result.name).toEqual(newProject.name);
        expect(result.room).toEqual(newProject.room);
        expect(result.building).toEqual(newProject.building);
      });
    });
  });

  describe("given values for isValid and sorting type return projects", () => {
    const existingProjectTrue1 = projectFactory.createValidProjectWithId({
      id: 13,
      isActive: true,
      ...projectFactory.createValidProject({ endDate: "05/12/2027", name: "B" }),
    });
    const existingProjectFalse1 = projectFactory.createValidProjectWithId({
      id: 10,
      isActive: false,
      ...projectFactory.createValidProject({ name: "E" }),
    });
    const existingProjectTrue2 = projectFactory.createValidProjectWithId({
      id: 14,
      isActive: true,
      ...projectFactory.createValidProject({ endDate: "05/08/2027", name: "A" }),
    });
    const existingProjectFalse2 = projectFactory.createValidProjectWithId({
      id: 11,
      isActive: false,
      ...projectFactory.createValidProject({ name: "C" }),
    });
    const projects = [
      existingProjectTrue1,
      existingProjectFalse1,
      existingProjectTrue2,
      existingProjectFalse2,
    ];

    describe("given isValid true and sorting=asc", () => {
      it("should return projects with isValid=true orderd in asc by name", async () => {
        expect.assertions(6);

        jest.spyOn(projectRepository, "findAll").mockImplementationOnce((active, order) => {
          const projectsReturn = projects.filter((val) => val.isActive === active);
          if (order === "asc") {
            return projectsReturn.sort((p1, p2) => (p1.name > p2.name ? 1 : -1));
          } else {
            return projectsReturn.sort((p1, p2) => (p1.name > p2.name ? -1 : 1));
          }
        });
        const result = await projectService.findAll(true, "asc");

        expect(result[0].name).toEqual(existingProjectTrue2.name);
        expect(result[1].name).toEqual(existingProjectTrue1.name);
        expect(result[0].id).toEqual(existingProjectTrue2.id);
        expect(result[1].id).toEqual(existingProjectTrue1.id);
        expect(result[0].isActive).toEqual(true);
        expect(result[1].isActive).toEqual(true);
      });
    });

    describe("given isValid true and sorting=desc", () => {
      it("should return projects with isValid=true orderd in desc by name", async () => {
        expect.assertions(6);

        jest.spyOn(projectRepository, "findAll").mockImplementationOnce((active, order) => {
          const projectsReturn = projects.filter((val) => val.isActive === active);
          if (order === "asc") {
            return projectsReturn.sort((p1, p2) => (p1.name > p2.name ? 1 : -1));
          } else {
            return projectsReturn.sort((p1, p2) => (p1.name > p2.name ? -1 : 1));
          }
        });
        const result = await projectService.findAll(true, "desc");

        expect(result[1].name).toEqual(existingProjectTrue2.name);
        expect(result[0].name).toEqual(existingProjectTrue1.name);
        expect(result[1].id).toEqual(existingProjectTrue2.id);
        expect(result[0].id).toEqual(existingProjectTrue1.id);
        expect(result[1].isActive).toEqual(true);
        expect(result[0].isActive).toEqual(true);
      });
    });
    describe("given isValid false and sorting=desc", () => {
      it("should return projects with isValid=false orderd in desc by name", async () => {
        expect.assertions(6);

        jest.spyOn(projectRepository, "findAll").mockImplementationOnce((active, order) => {
          const projectsReturn = projects.filter((val) => val.isActive === active);
          if (order === "asc") {
            return projectsReturn.sort((p1, p2) => (p1.name > p2.name ? 1 : -1));
          } else {
            return projectsReturn.sort((p1, p2) => (p1.name > p2.name ? -1 : 1));
          }
        });
        const result = await projectService.findAll(false, "desc");

        expect(result[1].name).toEqual(existingProjectFalse2.name);
        expect(result[0].name).toEqual(existingProjectFalse1.name);
        expect(result[1].id).toEqual(existingProjectFalse2.id);
        expect(result[0].id).toEqual(existingProjectFalse1.id);
        expect(result[1].isActive).toEqual(false);
        expect(result[0].isActive).toEqual(false);
      });
    });

    describe("given isValid false and sorting=asc", () => {
      it("should return projects with isValid=false orderd in asc by name", async () => {
        expect.assertions(6);

        jest.spyOn(projectRepository, "findAll").mockImplementationOnce((active, order) => {
          const projectsReturn = projects.filter((val) => val.isActive === active);
          if (order === "asc") {
            return projectsReturn.sort((p1, p2) => (p1.name > p2.name ? 1 : -1));
          } else {
            return projectsReturn.sort((p1, p2) => (p1.name > p2.name ? -1 : 1));
          }
        });
        const result = await projectService.findAll(false, "asc");

        expect(result[0].name).toEqual(existingProjectFalse2.name);
        expect(result[1].name).toEqual(existingProjectFalse1.name);
        expect(result[0].id).toEqual(existingProjectFalse2.id);
        expect(result[1].id).toEqual(existingProjectFalse1.id);
        expect(result[0].isActive).toEqual(false);
        expect(result[1].isActive).toEqual(false);
      });
    });
  });
});
