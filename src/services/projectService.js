import * as projectRepository from "../repositories/projectRepository";
import * as dateUtils from "../utils/dateUtils";
import ProjectInvalidEndDateError from "../errors/ProjectInvalidEndDateError";
import ProjectInvalidAtributeError from "../errors/ProjectInvalidAtributeError";
import ProjectNotFoundError from "../errors/ProjectNotFoundError";

export async function createProject(project) {
  let isActive = true;
  const creationDate = new Date(dateUtils.dateToIso(project.creationDate));

  if (project.endDate) {
    const endDateProject = new Date(dateUtils.dateToIso(project.endDate));
    isActive = isProjectActive(creationDate, endDateProject);
    const newProject = {
      ...project,
      isActive,
      creationDate: creationDate,
      endDate: endDateProject,
    };
    return await projectRepository.insertProject(newProject);
  }
  const newProject = {
    ...project,
    isActive,
    creationDate: creationDate,
  };

  return await projectRepository.insertProject(newProject);
}

export async function findProjectById(id) {
  if (isNaN(id)) {
    throw new ProjectInvalidAtributeError("id", id);
  }

  const project = await projectRepository.findById(id);

  return project;
}

export async function updateProject(project) {
  const projectToChange = await projectRepository.findById(project.id);

  if (!projectToChange) {
    throw new ProjectNotFoundError("id", project.id);
  }
  let { isActive, endDate, creationDate } = projectToChange;

  let newProject = {
    ...project,
  };

  // Verificação das datas de criação e datas de término do projeto
  // Caso alguma dessas sejam alteradas, é preciso fazer toda a lógica que ativa ou desativa o projeto
  // Primeiramente é checada se a data de criação é inserida e é válida, após isso checa-se se existe a data
  // de término, ou se ela foi inserida e é válida.
  if (typeof project.creationDate !== "undefined") {
    creationDate = new Date(dateUtils.dateToIso(project.creationDate));

    if (project.endDate) {
      endDate = new Date(dateUtils.dateToIso(project.endDate));
      isActive = isProjectActive(creationDate, endDate);
    } else if (projectToChange.endDate) {
      isActive = isProjectActive(creationDate, endDate);
    }
    newProject = {
      ...project,
      isActive,
      creationDate,
      endDate,
    };
  } else if (project.endDate) {
    endDate = new Date(dateUtils.dateToIso(project.endDate));
    isActive = isProjectActive(creationDate, endDate);

    newProject = {
      ...project,
      isActive,
      endDate,
    };
  }
  return await projectRepository.updateProject(newProject);
}

function isProjectActive(creationDate, endDate) {
  if (creationDate > endDate) {
    throw new ProjectInvalidEndDateError(endDate);
  }

  const today = new Date();
  const isActive = endDate >= today;

  return isActive;
}

export async function findAll(isActive, order) {
  return projectRepository.findAll(isActive, order);
}
