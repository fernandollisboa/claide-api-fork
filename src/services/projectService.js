import * as projectRepository from "../repositories/projectRepository";
import * as dateUtils from "../utils/dateUtils";
import { endDateError } from "../utils/customErrorsProject";

export async function createProject(project) {
  let status = true;

  const creationDate = new Date(dateUtils.dateToIso(project.creationDate));

  if (typeof project.endDate !== "undefined") {
    const endDateProject = new Date(dateUtils.dateToIso(project.endDate));

    if (creationDate > endDateProject) {
      throw endDateError(project.endDate);
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

export async function getProjectByName(name) {
  const project = projectRepository.findByName(name);

  if (!project) {
    throw Error("Projeto não encontrado");
  }
}

export async function getProjectByCode(code) {
  const project = projectRepository.findByEmbrapiiCode(code);

  if (!project) {
    throw Error("Projeto não encontrado");
  }
}

export async function findAll() {
  return projectRepository.findAll();
}
