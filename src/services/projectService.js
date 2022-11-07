import * as projectRepository from "../repositories/projectRepository";
import * as dateUtils from "../utils/dateUtils";
import { endDateError, invalidAtribute } from "../utils/customErrorsProject";
import { NotFoundError } from "@prisma/client/runtime";

export async function createProject(project) {
  let status = true;
  const creationDate = new Date(dateUtils.dateToIso(project.creationDate));

  if (typeof project.endDate !== "undefined") {
    const endDateProject = new Date(dateUtils.dateToIso(project.endDate));
    status = checkStatus(creationDate, endDateProject);
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

export async function updateProject(project) {
  const projectToChange = findById(project.id);
  if (!projectToChange) {
    throw new NotFoundError("id", project.id);
  }
}

function checkStatus(creationDate, endDateProject) {
  let status = true;

  if (creationDate > endDateProject) {
    throw new endDateError(endDateProject);
  }

  const dateNow = new Date();

  if (endDateProject <= dateNow) {
    status = false;
  }

  return status;
}

export async function findAll() {
  return projectRepository.findAll();
}
