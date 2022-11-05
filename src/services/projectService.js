import * as projectRepository from "../repositories/projectRepository";
import * as dateUtils from "../utils/dateUtils";
import { endDateError, invalidAtribute } from "../utils/customErrorsProject";

export async function createProject(project) {
  let status = true;

  const creationDate = new Date(dateUtils.dateToIso(project.creationDate));

  if (typeof project.endDate !== "undefined") {
    const endDateProject = new Date(dateUtils.dateToIso(project.endDate));

    if (creationDate > endDateProject) {
      throw new endDateError(project.endDate);
    }

    const dateNow = new Date();

    if (endDateProject <= dateNow) {
      status = false;
    }
    const newProject = {
      ...project,
      status: status,
      creationDate: creationDate,
      endDate: endDateProject,
    };
    return await projectRepository.insertProject(newProject);
  }
  const newProject = {
    ...project,
    status: status,
    creationDate: creationDate,
  };

  return await projectRepository.insertProject(newProject);
}

export async function findById(id) {
  if (isNaN(id)) {
    throw new invalidAtribute("id", id);
  }

  const project = await projectRepository.findById(id);

  return project;
}

export async function findAll() {
  return projectRepository.findAll();
}
