import * as projectAssociationRepository from "../repositories/projectAssociationRepository";
import { activateMember, deactivateMember } from "../services/memberService";
import * as projectService from "../services/projectService";
import ProjectAssociationDateError from "../errors/ProjectAssociationDateError";
import { getUsername } from "../services/authService";
import * as activityRecordService from "./activityRecordService";
import ProjectAssociationNotFoundError from "../errors/ProjectAssociationNotFoundError";

export async function createProjectAssociation(projectAssociation, token) {
	const { memberId, projectId, startDate, endDate } = projectAssociation;

	const project = await projectService.findProjectById(projectId);
	if (
		project.creationDate >= startDate ||
    (project.endDate && endDate && project.endDate <= endDate)
	) {
		throw new ProjectAssociationDateError();
	}

	var association = projectAssociation;

	if (endDate && endDate <= new Date()) {
		association = { ...association, isActive: false };
	} else {
		await activateMember(memberId);
	}

	const newAssociation = await projectAssociationRepository.insertProjectAssociation(association);

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
		throw new ProjectAssociationNotFoundError("projectId and memberId", [
			projectAssociation.projectId,
			projectAssociation.memberId,
		]);
	}

	const { endDate, startDate } = projectAssociation;
	const project = await projectService.findProjectById(projectId);

	if (
		(startDate && project.creationDate >= startDate) ||
    (project.endDate && endDate && project.endDate < endDate)
	) {
		throw new ProjectAssociationDateError();
	}

	if (
		(associationToChange.endDate && startDate && associationToChange.endDate < startDate) ||
    (endDate && associationToChange.startDate > endDate)
	) {
		throw new ProjectAssociationDateError(
			"the project association startDate must be before than the endDate"
		);
	}

	let newProjectAssociation = {
		...associationToChange,
		endDate,
		startDate,
	};

	if (endDate && endDate <= new Date()) {
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

export async function verifyProjectDate(association, updateCreationDate, updateEndDate) {
	if (association.startDate < updateCreationDate) {
		throw new ProjectAssociationDateError(
			"The project shouldn't start after any of its associations"
		);
	}
	if ((association.endDate && updateEndDate) && association.endDate > updateEndDate) {
		throw new ProjectAssociationDateError(
			"The project shouldn't end before any of its associations"
		);
	}
}
