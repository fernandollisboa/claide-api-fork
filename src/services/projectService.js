import * as projectRepository from "../repositories/projectRepository";
import ProjectInvalidCreationOrEndDateError from "../errors/ProjectInvalidCreationOrEndDateError";
import InvalidAtributeError from "../errors/InvalidAtributeError";
import ProjectNotFoundError from "../errors/ProjectNotFoundError";
import dayjs from "dayjs";

export async function createProject(project) {
  const { creationDate, endDate } = project;
  const today = dayjs().toISOString();

  const isActive = isProjectActive(creationDate, endDate ?? today);

  const newProject = {
    ...project,
    isActive,
    creationDate,
    endDate,
  };

  return await projectRepository.insertProject(newProject);
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

  const newEndDate = updateEndDate ?? originalEndDate;
  const newCreationDate = updateCreationDate ?? originalCreationDate;

  const newIsActive = isProjectActive(newCreationDate, newEndDate);

  const newProject = {
    ...updateProject,
    creationDate: newCreationDate,
    endDate: newEndDate,
    isActive: newIsActive,
  };
  return await projectRepository.updateProject(newProject);
}

function isProjectActive(creationDate, endDate) {
  if (creationDate > endDate) {
    throw new ProjectInvalidCreationOrEndDateError(creationDate, endDate);
  }
  const today = new Date();

  const isActive = endDate >= today;

  return isActive;
}

export async function findAll(isActive, order) {
  return projectRepository.findAll(isActive, order);
}
