import * as projectRepository from "../repositories/projectRepository";
import ProjectInvalidCreationOrEndDateError from "../errors/ProjectInvalidCreationOrEndDateError";
import InvalidAtributeError from "../errors/InvalidAtributeError";
import ProjectNotFoundError from "../errors/ProjectNotFoundError";
import dayjs from "dayjs";

export async function createProject(projectData) {
  const { creationDate, endDate } = projectData;

  const isActive = isProjectActive(projectData);

  const project = {
    ...projectData,
    isActive,
    creationDate,
    endDate,
  };

  return await projectRepository.insertProject(project);
}

export async function findProjectById(id) {
  if (isNaN(id)) {
    throw new InvalidAtributeError("id", id);
  }

  const project = await projectRepository.findById(id);

  if (!project) {
    throw new ProjectNotFoundError("id", id);
  }

  return project;
}

export async function updateProject(updateProject) {
  const { id } = updateProject;
  const originalProject = await projectRepository.findById(id);

  if (!originalProject) {
    throw new ProjectNotFoundError("id", id);
  }

  const { endDate: originalEndDate, creationDate: originalCreationDate } = originalProject;
  const { endDate: updateEndDate, creationDate: updateCreationDate } = updateProject;

  const endDate = updateEndDate ?? originalEndDate;
  const creationDate = updateCreationDate ?? originalCreationDate;

  const newIsActive = isProjectActive({ endDate, creationDate });

  const newProject = {
    ...updateProject,
    creationDate,
    endDate,
    isActive: newIsActive,
  };
  return await projectRepository.updateProject(newProject);
}

export function isProjectActive({ creationDate, endDate }) {
  const today = dayjs().toISOString();

  if (!endDate) {
    return creationDate <= today;
  }

  if (creationDate > endDate) {
    throw new ProjectInvalidCreationOrEndDateError(creationDate, endDate);
  }

  return endDate >= today;
}

export async function findAll(isActive, order) {
  return projectRepository.findAll(isActive, order);
}
