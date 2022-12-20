import * as projectAssociationRepository from "../repositories/projectAssociationRepository";
import { activateMember, deactivateMember } from "../services/memberService";
import * as projectService from "../services/projectService";
import ProjectAssociationDateError from "../errors/ProjectAssociationDateError";
import ProjectAssociationNotFoundError from "../errors/ProjectAssociationNotFoundError";

export async function createProjectAssociation(projectAssociation) {
  const { memberId, projectId, startDate, endDate } = projectAssociation;

  const project = await projectService.findProjectById(projectId);
  if (
    project.creationDate.getTime() >= startDate.getTime() ||
    (project.endDate && endDate && project.endDate.getTime() <= endDate.getTime())
  ) {
    throw new ProjectAssociationDateError();
  }

  var association = projectAssociation;

  if (endDate && endDate.getTime() <= new Date().getTime()) {
    association = { ...association, isActive: false };
  } else {
    await activateMember(memberId);
  }

  return await projectAssociationRepository.insertProjectAssociation(association);
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
    throw new ProjectAssociationNotFoundError("projectId and memberId", [
      projectAssociation.projectId,
      projectAssociation.memberId,
    ]);
  }

  const { endDate, startDate } = projectAssociation;
  const project = await projectService.findProjectById(projectId);
  if (
    (startDate && project.creationDate.getTime() >= startDate.getTime()) ||
    (project.endDate && endDate && project.endDate.getTime() < endDate.getTime())
  ) {
    throw new ProjectAssociationDateError();
  }

  let newProjectAssociation = {
    ...associationToChange,
    endDate,
    startDate,
  };

  if (endDate && endDate.getTime() <= new Date().getTime()) {
    newProjectAssociation = { ...newProjectAssociation, isActive: false };

    const memberAssociations = await projectAssociationRepository.findByMemberId(
      newProjectAssociation.memberId
    );

    let keepActivate = false;
    memberAssociations.map((association) => {
      if (association.isActive && association.projectId !== newProjectAssociation.projectId) {
        keepActivate = true;
      }
    });

    if (!keepActivate) {
      await deactivateMember(newProjectAssociation.memberId);
    }
  }
  const association = await projectAssociationRepository.updateAssociation(newProjectAssociation);

  return association;
}
