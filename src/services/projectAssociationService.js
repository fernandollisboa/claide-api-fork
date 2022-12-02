import * as projectAssociationRepository from "../repositories/projectAssociationRepository";
import ProjectNotFoundError from "../errors/ProjectInvalidEndDateError";
import { activateMember } from "../services/memberService";
import * as projectService from "../services/projectService";
import ProjectAssociationDateError from "../errors/ProjectAssociationDateError";

export async function createProjectAssociation(projectAssociation) {
  const { memberId, projectId, startDate, endDate } = projectAssociation;

  const project = await projectService.findProjectById(projectId);
  if (
    project.creationDate.getTime() >= startDate.getTime() ||
    (project.endDate && endDate && project.endDate.getTime() <= endDate.getTime())
  ) {
    throw new ProjectAssociationDateError();
  }

  await activateMember(memberId);

  return await projectAssociationRepository.insertProjectAssociation(projectAssociation);
}

export async function findByProjectId(projectId) {
  const project = await projectAssociationRepository.findByProjectId(projectId);

  return project;
}

export async function findByMemberId(memberId) {
  const project = await projectAssociationRepository.findByMemberId(memberId);

  return project;
}

export async function findByProjectIdAndMemberId(projectId, memberId) {
  const project = await projectAssociationRepository.findByProjectIdAndMemberId(
    projectId,
    memberId
  );

  return project;
}

export async function updateProjectAssociation(projectAssociation) {
  const { memberId, projectId } = projectAssociation;
  const associationToChange = await projectAssociationRepository.findByProjectIdAndMemberId(
    projectId,
    memberId
  );

  if (!associationToChange) {
    throw new ProjectNotFoundError("projectId and username", [
      projectAssociation.projectId,
      projectAssociation.username,
    ]);
  }
  const { endDate, startDate } = associationToChange;

  const newProjectAssociation = {
    ...projectAssociation,
    endDate,
    startDate,
  };
  return await projectAssociationRepository.updateAssociation(newProjectAssociation);
}
