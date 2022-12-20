import * as projectAssociationRepository from "../repositories/projectAssociationRepository";
import { activateMember } from "../services/memberService";
import * as projectService from "../services/projectService";
import ProjectAssociationDateError from "../errors/ProjectAssociationDateError";
import ProjectNotFoundError from "../errors/ProjectNotFoundError";
import { getUsername } from "../services/authService";
import * as activityRecordService from "./activityRecordService";

export async function createProjectAssociation(projectAssociation, token) {
  const { memberId, projectId, startDate, endDate } = projectAssociation;

  const project = await projectService.findProjectById(projectId);
  if (
    project.creationDate.getTime() >= startDate.getTime() ||
    (project.endDate && endDate && project.endDate.getTime() <= endDate.getTime())
  ) {
    throw new ProjectAssociationDateError();
  }

  await activateMember(memberId);

  const newAssociation = await projectAssociationRepository.insertProjectAssociation(
    projectAssociation
  );

  const activity = {
    operation: "CREATE",
    entity: "PROJECT_ASSOCIATION",
    newValue: newAssociation,
    idEntity: newAssociation.id,
    user: getUsername(token),
  };

  activityRecordService.createActivity(activity);

  return newAssociation;
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

export async function updateProjectAssociation(projectAssociation, token) {
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
  const { endDate, startDate } = projectAssociation;

  const project = await projectService.findProjectById(projectId);
  if (
    (startDate && project.creationDate.getTime() >= startDate.getTime()) ||
    (project.endDate && endDate && project.endDate.getTime() <= endDate.getTime())
  ) {
    throw new ProjectAssociationDateError();
  }

  const newProjectAssociation = {
    ...associationToChange,
    endDate,
    startDate,
  };

  const associationUpdated = await projectAssociationRepository.updateAssociation(
    newProjectAssociation
  );

  const activity = {
    operation: "UPDATE",
    entity: "PROJECT_ASSOCIATION",
    oldValue: associationToChange,
    newValue: associationUpdated,
    idEntity: associationUpdated.id,
    user: getUsername(token),
  };
  activityRecordService.createActivity(activity);

  return associationUpdated;
}
