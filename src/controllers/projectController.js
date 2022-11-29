import * as projectService from "../services/projectService";
import * as projectAssociationService from "../services/projectAssociationService";
import { activeMember } from "../services/memberService";
import { parseBrDateToStandardDate } from "../utils/dateUtils";
import InvalidParamError from "../errors/InvalidParamError";

export async function createProject(req, res, next) {
  const { body } = req;
  try {
    let { creationDate, endDate } = body;
    creationDate = parseBrDateToStandardDate(creationDate);
    if (endDate) endDate = parseBrDateToStandardDate(endDate);

    const projectData = { ...body, creationDate, endDate };
    const createdProject = await projectService.createProject(projectData);

    return res.status(201).send(createdProject);
  } catch (err) {
    next(err);
  }
}

export async function getAllProjects(req, res, next) {
  const { isActive, desc } = req.query;
  let isActiveBoolean;
  const order = desc === "true" ? "desc" : "asc";

  if (isActive) {
    isActiveBoolean = isActive === "true";
  }

  try {
    const projects = await projectService.findAll(isActiveBoolean, order);
    return res.status(200).send(projects);
  } catch (err) {
    next(err);
  }
}

export async function getProjectById(req, res, next) {
  const { id: idToken } = req.params;
  const id = Number(idToken);
  try {
    if (isNaN(id)) {
      throw new InvalidParamError("projectId", idToken);
    }

    const project = await projectService.findProjectById(id);
    return res.status(200).send(project);
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req, res, next) {
  const { body } = req;
  try {
    let { creationDate, endDate } = body;
    if (creationDate) creationDate = parseBrDateToStandardDate(creationDate);
    if (endDate) endDate = parseBrDateToStandardDate(endDate);

    const projectData = { ...body, creationDate, endDate };
    const project = await projectService.updateProject(projectData);

    return res.status(200).send(project);
  } catch (err) {
    next(err);
  }
}

export async function createProjectAssociation(req, res) {
  const { params, body } = req;
  const projectId = Number(params.projectId);
  const association = {
    ...body,
    projectId,
  };

  try {
    await activeMember(body.username);
  } catch (err) {
    return res.status(400).send(err.message);
  }

  const project = await projectService.findProjectById(projectId);
  if (!project.isActive) {
    return res.status(400).send("Project is disabled");
  }

  try {
    const createdProjectAssociation = await projectAssociationService.createProjectAssociation(
      association
    );
    return res.status(201).send(createdProjectAssociation);
  } catch (err) {
    return res.status(400).send(err.message);
  }
}

export async function getProjectAssociationsByProjectId(req, res, next) {
  const { projectId: projectIdToken } = req.params;
  const projectId = Number(projectIdToken);
  try {
    if (isNaN(projectId)) {
      throw new InvalidParamError("projectId", projectId);
    }
    const associations = await projectAssociationService.findByProjectId(projectId);

    return res.status(200).send(associations);
  } catch (err) {
    next(err);
  }
}

export async function getProjectAssociationsByUsername(req, res, next) {
  const { username } = req.params;
  try {
    const associations = await projectAssociationService.findByUsername(username);
    return res.status(200).send(associations);
  } catch (err) {
    next(err);
  }
}

export async function getProjectAssociationsByProjectIdAndUsername(req, res, next) {
  const { projectId: projectIdToken, username } = req.params;
  const projectId = Number(projectIdToken);
  try {
    if (isNaN(projectId)) {
      throw new InvalidParamError("projectId", projectId);
    }
    const associations = await projectAssociationService.findByProjectIdAndUsername(
      projectId,
      username
    );

    return res.status(200).send(associations);
  } catch (err) {
    next(err);
  }
}

export async function updateProjectAssociation(req, res, next) {
  const { body } = req;

  try {
    const projectAssociation = await projectAssociationService.updateProjectAssociation(body);
    return res.status(200).send(projectAssociation);
  } catch (err) {
    next(err);
  }
}
