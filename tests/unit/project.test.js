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
            const validProjectId = projectFactory.createValidProjectWithId({id: projectId, isActive: true});

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
            const validProjectId = projectFactory.createValidProjectWithId({id: projectId, isActive: true});

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
            describe("given valid creation and end dates to change the status of the project", () =>{
                it("should update the status to false and the creation and end dates", async ()=>{
                    expect.assertions(4);
                    const newProject = projectFactory.createValidProjectWithId({...existingProject, creationDate: "01/01/2010", endDate: "02/02/2020"});
                    
                    jest.spyOn(projectRepository, "findById").mockResolvedValueOnce(existingProject);
                    jest.spyOn(projectRepository, "updateProject").mockImplementationOnce(() => {
                        newProject.isActive = false;
                        return newProject
                    });                  
                    
                    const result = await projectService.updateProject(newProject);
                    expect(projectRepository.findById).toBeCalledWith(newProject.id);
                    expect(result.isActive).toEqual(false);
                    expect(result.creationDate).toEqual(newProject.creationDate);
                    expect(result.endDate).toEqual(newProject.endDate);
                });
            });

            describe("given valid end date to change the status of the project", () =>{
                it("should update the status to false and the end date", async ()=>{
                    expect.assertions(4);
                    const newProject = projectFactory.createValidProjectWithoutCreationDateWithId({...existingProject, endDate: "15/10/2026", creationDate: undefined});
                    

                    jest.spyOn(projectRepository, "findById").mockResolvedValueOnce(existingProject);
                    jest.spyOn(projectRepository, "updateProject").mockImplementationOnce(() => {
                        newProject.isActive = true;
                        newProject.creationDate = existingProject.creationDate;
                        return newProject
                    });                  
                    
                    const result = await projectService.updateProject(newProject);
                    expect(projectRepository.findById).toBeCalledWith(newProject.id);
                    expect(result.isActive).toEqual(true);
                    expect(result.creationDate).toEqual(existingProject.creationDate);
                    expect(result.endDate).toEqual(newProject.endDate);
                });
            });
            describe("given valids attributes to update  a project", () =>{
                it("should update the project with new attributes", async ()=>{
                    expect.assertions(4);
                    const newProject = projectFactory.createValidProjectWithId({...existingProject, name:"Update Name", 
                    room: "Update Room", building: "Update Building"});
                    jest.spyOn(projectRepository, "findById").mockResolvedValueOnce(existingProject);
                    jest.spyOn(projectRepository, "updateProject").mockImplementationOnce(() => {
                        return newProject
                    });                  

                    const result = await projectService.updateProject(newProject);
                    expect(projectRepository.findById).toBeCalledWith(newProject.id);
                    expect(result.name).toEqual(newProject.name);
                    expect(result.room).toEqual(newProject.room);
                    expect(result.building).toEqual(newProject.building);
                });
            });
        });

        describe("given values for isValid and sorting type return projects", () =>{
            const existingProjectTrue1 = projectFactory.createValidProjectWithId({id: 13, isActive:true, ...projectFactory.createValidProject({endDate: "05/12/2027", name: "B"})});
            const existingProjectFalse1 = projectFactory.createValidProjectWithId({id:10, isActive:false, ...projectFactory.createValidProject({name:"E"})}); 
            const existingProjectTrue2= projectFactory.createValidProjectWithId({id: 14, isActive:true, ...projectFactory.createValidProject({endDate: "05/08/2027", name: "A"})});
            const existingProjectFalse2 = projectFactory.createValidProjectWithId({id:11, isActive:false, ...projectFactory.createValidProject({name:"C"})}); 
            const projects = [existingProjectTrue1,existingProjectFalse1,existingProjectTrue2,existingProjectFalse2];
            
        
        describe("given isValid true and sorting=asc", () => {
            it("should return projects with isValid=true orderd in asc by name", async () => {
                expect.assertions(6);
                
                jest.spyOn(projectRepository, "findAll").mockImplementation((active,order) => {
                    const projectsReturn =  projects.filter(val => val.isActive === active);
                    if(order === 'asc'){
                        return projectsReturn.sort((p1,p2) => p1.name > p2.name?1:-1);
                    }
                    else{
                        return projectsReturn.sort((p1,p2) => p1.name > p2.name?-1:1);
                    }                                    
                });
                const result = await projectService.findAll(true,"asc");
                
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
                
                jest.spyOn(projectRepository, "findAll").mockImplementation((active,order) => {
                    const projectsReturn =  projects.filter(val => val.isActive === active);
                    if(order === 'asc'){
                        return projectsReturn.sort((p1,p2) => p1.name > p2.name?1:-1);
                    }
                    else{
                        return projectsReturn.sort((p1,p2) => p1.name > p2.name?-1:1);
                    }                                    
                });
                const result = await projectService.findAll(true,"desc");
                
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
                
                jest.spyOn(projectRepository, "findAll").mockImplementation((active,order) => {
                    const projectsReturn =  projects.filter(val => val.isActive === active);
                    if(order === 'asc'){
                        return projectsReturn.sort((p1,p2) => p1.name > p2.name?1:-1);
                    }
                    else{
                        return projectsReturn.sort((p1,p2) => p1.name > p2.name?-1:1);
                    }                                    
                });
                const result = await projectService.findAll(false,"desc");
                
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
                
                jest.spyOn(projectRepository, "findAll").mockImplementation((active,order) => {
                    const projectsReturn =  projects.filter(val => val.isActive === active);
                    if(order === 'asc'){
                        return projectsReturn.sort((p1,p2) => p1.name > p2.name?1:-1);
                    }
                    else{
                        return projectsReturn.sort((p1,p2) => p1.name > p2.name?-1:1);
                    }                                    
                });
                const result = await projectService.findAll(false,"asc");
                
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
});
