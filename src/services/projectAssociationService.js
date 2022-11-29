import * as projectAssociationRepository from "../repositories/projectAssociationRepository";
import * as dateUtils from "../utils/dateUtils";
import InvalidAtributeError from "../errors/InvalidAtributeError";
import ProjectNotFoundError from "../errors/ProjectNotFoundError";

export async function createProjectAssociation(projectAssociation) {
  const startDate = new Date(dateUtils.dateToIso(projectAssociation.startDate));

  if (projectAssociation.endDate) {
    const endDate = new Date(dateUtils.dateToIso(projectAssociation.endDate));
    const newProjectAssociation = {
      ...projectAssociation,
      startDate,
      endDate,
    };
    return await projectAssociationRepository.insertProjectAssociation(newProjectAssociation);
  }
  const newProjectAssociation = {
    ...projectAssociation,
    startDate,
  };

  return await projectAssociationRepository.insertProjectAssociation(newProjectAssociation);
}

export async function findByProjectId(projectId) {
  if (isNaN(projectId)) {
    throw new InvalidAtributeError("projectId", projectId);
  }

  const project = await projectAssociationRepository.findByProjectId(projectId);

  return project;
}

export async function findByUsername(username) {
  const project = await projectAssociationRepository.findByUsername(username);

  return project;
}

export async function findByProjectIdAndUsername(projectId, username) {
  const project = await projectAssociationRepository.findByProjectIdAndUsername(
    projectId,
    username
  );

  return project;
}

export async function updateProjectAssociation(projectAssociation) {
  const associationToChange = await projectAssociationRepository.findByProjectIdAndUsername(
    projectAssociation.projectId,
    projectAssociation.username
  );

  if (!associationToChange) {
    throw new ProjectNotFoundError("projectId and username", [
      projectAssociation.projectId,
      projectAssociation.username,
    ]);
  }
  let { endDate, startDate } = associationToChange;

  if (typeof projectAssociation.startDate !== "undefined") {
    startDate = new Date(dateUtils.dateToIso(projectAssociation.startDate));
  }
  if (typeof projectAssociation.endDate !== "undefined") {
    endDate = new Date(dateUtils.dateToIso(projectAssociation.endDate));
  }

  const newProjectAssociation = {
    ...projectAssociation,
    endDate,
    startDate,
  };
  return await projectAssociationRepository.updateAssociation(newProjectAssociation);
}
