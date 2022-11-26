import { jest } from "@jest/globals";
import { faker } from "@faker-js/faker";
import * as projectService from "../../src/services/projectService";
import * as projectRepository from "../../src/repositories/projectRepository";
import * as projectFactory from "../factories/projectFactory";
import { EndDateError, InvalidAttribute, NotFoundError } from "../../src/utils/customErrorsProject";

describe("project service", () => {
    describe("insert function", () => {
        describe("given the project data is valid", () =>{
            it("should creat a new project", async () => {
                const validProject = projectFactory.createValidProject()
                
                jest.spyOn(projectRepository, "findByName").mockResolvedValueOnce(null);
                jest.spyOn(projectRepository, "findByEmbrapiiCode").mockResolvedValueOnce(null);
                jest.spyOn(projectRepository, "findById").mockResolvedValueOnce(null),
                jest.spyOn(projectRepository, "insertProject").mockImplementationOnce(()=>{
                    return[{id:faker.datatype.uuid(), ...validProject}];
                });

                const result = projectService.createProject(validProject);

                expect(projectRepository.insertProject).toBeCalledTimes(1)
                expect(result).resolves.toMatchObject([validProject])

            });
        });
    
    describe("given a project only with creation date", () => {
        it("should be a project with isActive true", async () => {
            const newProject = projectFactory.createValidProjectWithoutEndDate({creationDate: "15/01/2020"});

            jest.spyOn(projectRepository, "insertProject").mockImplementationOnce(()=>{
                return[{id:faker.datatype.uuid(), isActive: true, ...newProject}]
            });

            const result = projectService.createProject(newProject);
            expect(result).resolves.toMatchObject([newProject]);
        });
    });
    
    describe("given a project already finished", ()=> {
        it("should be create a project with isActive false", async ()=> {
            const finalizedProject = projectFactory.createValidProject({creationDate:"15/01/2020", endDate:"15/01/2021"});  
            
            jest.spyOn(projectRepository, "insertProject").mockImplementationOnce(()=>{
                return[{id:faker.datatype.uuid(), isActive: false, ...finalizedProject}]
            });    

            const result = projectService.createProject(finalizedProject);                        
            expect(result).resolves.toMatchObject([finalizedProject])
        });
    });
    
    describe("given a project with end date older than creation date", ()=> {
        it("should not allow create the project", async () => {
            expect.assertions(3)
            const finalizedProject = projectFactory.createValidProject({creationDate:"15/12/2022", endDate:"15/12/2020"});            
            
            jest.spyOn(projectRepository, "insertProject").mockImplementationOnce(()=>{
                return[{id:faker.datatype.uuid(), isActive: false, ...finalizedProject}]
            });       

            const result = projectService.createProject(finalizedProject);
            
            expect(projectRepository.insertProject).not.toBeCalled();
            expect(result).rejects.toThrow(EndDateError)
            expect(result).rejects.toThrow("Creation date 15/12/2020 older than end date");
        });
    });

    describe("get project by id function", ()=> {
        it("given the project's id is valid", async () => {
            expect.assertions(3)
            const projectId = Math.floor(Math.random() * 11);
            const validProjectId = projectFactory.createValidProjectWithId({id: projectId, status: true});

            jest.spyOn(projectRepository, "findById").mockImplementationOnce(() => {
                return validProjectId
            });

            const result = await projectService.findById(projectId);

            expect(projectRepository.findById).toBeCalledTimes(1);
            expect(projectRepository.findById).toBeCalledWith(projectId);
            expect(result).toEqual(validProjectId);

        });
    });

    describe("given project's invalid id", () => {
        it("should not allow to get a project with a invalid id", async () => {
            expect.assertions(3);
            const projectId = Math.floor(Math.random() * 11);
            const validProjectId = projectFactory.createValidProjectWithId({id: projectId, status: true});

            jest.spyOn(projectRepository, "findById").mockImplementationOnce(() => {
                return validProjectId
            });

            const result = projectService.findById("a");

            expect(projectRepository.findById).not.toBeCalled();
            expect(result).rejects.toThrow(InvalidAttribute);
            expect(result).rejects.toHaveProperty("message", "Invalid attribute id: a");            
        });
    });

    describe("given project's id is not found", () => {
        it("should not allow to get a nonexistent project", async () => {
            expect.assertions(3);
            const projectId = Math.floor(Math.random() * 11);
            
            jest.spyOn(projectRepository, "findById").mockResolvedValueOnce();

            const result = projectService.findById(projectId*2);

            expect(projectRepository.findById).toBeCalledWith(projectId*2);
            expect(result).rejects.toThrow(NotFoundError);
            expect(result).rejects.toHaveProperty("message", `Project with id: ${projectId*2} not found`);
        });
    });
    
    describe("updateProject function", ()=>{
        const existingProject = projectFactory.createValidProjectWithId({id: 10, creationDate: "01/01/2010", endDate: "02/02/2020"});              
        const updateProjectWrongId = projectFactory.createValidProjectWithId({id: 13, name: "changed", ...existingProject});        
        
        describe("given project's id is not found", () => {
            it("should not allow to update a project with a nonexistent project", async () => {
                expect.assertions(3);  
                
                jest.spyOn(projectRepository, "findById").mockResolvedValueOnce();
                
                const result = projectService.updateProject(updateProjectWrongId);
                
                expect(projectRepository.findById).toBeCalledWith(updateProjectWrongId.id);
                expect(result).rejects.toThrow(NotFoundError);
                expect(result).rejects.toHaveProperty("message", `Project with id: ${updateProjectWrongId.id} not found`);                
                
            });
        });

            describe("given a end date older than creation date", () => {
                it("should not allow to update the end date", async () => {
                    expect.assertions(3);    
                    const newProject = projectFactory.createValidProjectWithId({...existingProject, endDate:"01/01/1999"});
    
                    jest.spyOn(projectRepository, "findById").mockResolvedValueOnce(existingProject);
    
                    const result = projectService.updateProject(newProject);
                    
                    expect(projectRepository.findById).toBeCalledWith(newProject.id);
                    await expect(result).rejects.toThrow(EndDateError);
                    expect(result).rejects.toHaveProperty("message", 
                    "Creation date 1/1/1999 older than end date")
                });
            });

            describe("given a creation date younger than creation date", () => {
                it("should not allow to update the creation date", async () => {
                    expect.assertions(3);    
                    const newProject = projectFactory.createValidProjectWithoutEndDateWithId({ ...existingProject,creationDate:"26/11/2022", endDate: undefined});                    
                    jest.spyOn(projectRepository, "findById").mockImplementationOnce(() => {
                        existingProject.endDate = new Date('02/02/2020');
                        return existingProject;
                    });
    
                    const result = projectService.updateProject(newProject);
                    
                    expect(projectRepository.findById).toBeCalledWith(newProject.id);
                    await expect(result).rejects.toThrow(EndDateError);
                    expect(result).rejects.toHaveProperty("message", 
                    "Creation date 2/2/2020 older than end date")
                });
            });

            describe("given only the end date older than creation date", () => {
                it("should not allow to update the end date", async () => {
                    expect.assertions(3);    
                    const newProject = projectFactory.createValidProjectWithoutCreationDateWithId({id:10, endDate: "03/08/1999", creationDate: undefined});   

                    console.log(newProject);

                    jest.spyOn(projectRepository, "findById").mockImplementationOnce(() => {
                        existingProject.creationDate = new Date(existingProject.creationDate);
                        return existingProject;
                    });   

                    const result = projectService.updateProject(newProject);
                    
                    expect(projectRepository.findById).toBeCalledWith(newProject.id);
                    await expect(result).rejects.toThrow(EndDateError);
                    expect(result).rejects.toHaveProperty("message", 
                    "Creation date 3/8/1999 older than end date")
                });
            });


        });
        
    });
    


})