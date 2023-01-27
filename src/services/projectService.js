import * as projectRepository from "../repositories/projectRepository";
import * as activityRecordService from "./activityRecordService";
import { getUsername } from "../services/authService";
import {
  findByProjectId,
  updateProjectAssociation,
  verifyProjectDate,
} from "../services/projectAssociationService";
import ProjectInvalidCreationOrEndDateError from "../errors/ProjectInvalidCreationOrEndDateError";
import ProjectNotFoundError from "../errors/ProjectNotFoundError";
import dayjs from "dayjs";

export async function createProject(projectData, token) {
  const { creationDate, endDate } = projectData;

  const isActive = isProjectActive(projectData);

  const project = {
    ...projectData,
    isActive,
    creationDate,
    endDate,
  };

  const newProject = await projectRepository.insertProject(project);

  const activity = {
    operation: "CREATE",
    entity: "PROJECT",
    newValue: newProject,
    idEntity: newProject.id,
    user: getUsername(token),
  };

  activityRecordService.createActivity(activity);

  return newProject;
}

export async function findProjectById(id) {
  const project = await projectRepository.findById(id);

  if (!project) {
    throw new ProjectNotFoundError("id", id);
  }

  return project;
}

export async function updateProject(updateProject, token) {
  const { id } = updateProject;
  const originalProject = await projectRepository.findById(id);

  if (!originalProject) {
    throw new ProjectNotFoundError("id", id);
  }

  const { endDate: originalEndDate, creationDate: originalCreationDate } = originalProject;

  const { endDate: updateEndDate, creationDate: updateCreationDate } = updateProject;

  const endDate = updateEndDate ?? originalEndDate?.toISOString();
  const creationDate = updateCreationDate ?? originalCreationDate.toISOString();

  const isActive = isProjectActive({ creationDate, endDate });

  if (updateEndDate || updateCreationDate) {
    const associations = await findByProjectId(id);
    const promises = associations.map((association) =>
      verifyProjectDate(association, updateCreationDate, updateEndDate)
    );
    await Promise.all(promises);
  }

  if (!isActive) {
    const associations = await findByProjectId(id);
    const promises = associations.map((association) =>
      updateProjectAssociation({ ...association, endDate: new Date(endDate) }, token)
    );
    await Promise.all(promises);
  }

  const newProject = {
    ...updateProject,
    creationDate,
    endDate,
    isActive,
  };

  const projectUpdated = await projectRepository.updateProject(newProject);

  const activity = {
    operation: "UPDATE",
    entity: "PROJECT",
    oldValue: originalProject,
    newValue: newProject,
    idEntity: newProject.id,
    user: getUsername(token),
  };

  activityRecordService.createActivity(activity);

  return projectUpdated;
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
