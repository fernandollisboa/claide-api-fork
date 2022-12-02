import { createProjectSchema } from "../schemas/createProjectSchema";
import { updateProjectSchema } from "../schemas/updateProjectSchema";
import { createProjectAssociationSchema } from "../schemas/createProjectAssociationSchema";
import { updateProjectAssociationSchema } from "../schemas/updateProjectAssociationSchema";
import * as projectService from "../services/projectService";
import * as projectAssociationService from "../services/projectAssociationService";
import ProjectInvalidAtributeError from "../errors/ProjectInvalidAtributeError";
import BaseError from "../errors/BaseError";
import { dateToIso } from "../utils/dateUtils";

export async function createProject(req, res) {
  const { body } = req;

  const joiValidation = createProjectSchema.validate(body);

  if (joiValidation.error) {
    const typeError = joiValidation.error.details[0].type;
    if (typeError === "any.required" || typeError === "object.unknown") {
      return res.status(422).send(joiValidation.error.details[0].message);
    }
    return res.status(400).send(joiValidation.error.details[0].message);
  }

  try {
    const createdProject = await projectService.createProject(body);
    return res.status(201).send(createdProject);
  } catch (err) {
    return res.status(400).send(err.message);
  }
}

export async function getProjects(req, res) {
  const { isActive, desc } = req.query;
  let isActiveBoolean;
  const order = desc === "true" ? "desc" : "asc";
  if (isActive) {
    isActiveBoolean = isActive === "true";
  }
  const projects = await projectService.findAll(isActiveBoolean, order);

  try {
    return res.status(200).send(projects);
  } catch (err) {
    return err.status(500).send(err.message);
  }
}

export async function getProjectById(req, res) {
  const { params } = req;
  const id = parseInt(params.id);
  try {
    const project = await projectService.findById(id);
    return res.status(200).send(project);
  } catch (err) {
    return res.status(422).send(err.message);
  }
}

export async function updateProject(req, res) {
  const { body } = req;

  const joiValidation = updateProjectSchema.validate(body);

  if (joiValidation.error) {
    const typeError = joiValidation.error.details[0].type;
    if (typeError === "object.unknown") {
      return res.status(422).send(joiValidation.error.details[0].message);
    }
    return res.status(400).send(joiValidation.error.details[0].message);
  }

  try {
    const project = await projectService.updateProject(body);
    return res.status(200).send(project);
  } catch (err) {
    res.status(409).send(err.message);
  }
}

export async function createProjectAssociation(req, res, next) {
  const { params, body } = req;
  const projectId = parseInt(params.projectId);
  const memberId = parseInt(params.memberId);

  let association = {
    ...body,
    projectId,
    memberId,
  };

  const joiValidation = createProjectAssociationSchema.validate(association);

  if (joiValidation.error) {
    const typeError = joiValidation.error.details[0].type;
    if (typeError === "any.required" || typeError === "object.unknown") {
      return res.status(422).send(joiValidation.error.details[0].message);
    }
    return res.status(400).send(joiValidation.error.details[0].message);
  }

  const startDate = new Date(dateToIso(body.startDate));
  association = {
    ...association,
    startDate,
  };
  if (body.endDate) {
    const endDate = new Date(dateToIso(body.endDate));
    association = {
      ...association,
      endDate,
    };
  }

  try {
    const createdProjectAssociation = await projectAssociationService.createProjectAssociation(
      association
    );
    return res.status(201).send(createdProjectAssociation);
  } catch (err) {
    if (err instanceof BaseError) {
      return res.status(err.statusCode).send(err.message);
    }
    next(err);
  }
}

export async function getProjectAssociationsByProjectId(req, res, next) {
  const { params } = req;

  const projectId = parseInt(params.projectId);
  if (isNaN(projectId)) {
    throw new ProjectInvalidAtributeError("projectId", projectId);
  }

  try {
    const associations = await projectAssociationService.findByProjectId(projectId);
    return res.status(200).send(associations);
  } catch (err) {
    if (err instanceof BaseError) {
      return res.status(err.statusCode).send(err.message);
    }
    next(err);
  }
}

export async function getProjectAssociationsByMemberId(req, res, next) {
  const { params } = req;

  const memberId = parseInt(params.memberId);
  if (isNaN(memberId)) {
    throw new ProjectInvalidAtributeError("projectId", memberId);
  }

  try {
    const associations = await projectAssociationService.findByMemberId(memberId);
    return res.status(200).send(associations);
  } catch (err) {
    if (err instanceof BaseError) {
      return res.status(err.statusCode).send(err.message);
    }
    next(err);
  }
}

export async function getProjectAssociationsByProjectIdAndMemberId(req, res, next) {
  const { params } = req;

  const projectId = parseInt(params.projectId);
  if (isNaN(projectId)) {
    throw new ProjectInvalidAtributeError("projectId", projectId);
  }
  const memberId = parseInt(params.projectId);
  if (isNaN(memberId)) {
    throw new ProjectInvalidAtributeError("projectId", memberId);
  }

  try {
    const associations = await projectAssociationService.findByProjectIdAndMemberId(
      projectId,
      memberId
    );
    return res.status(200).send(associations);
  } catch (err) {
    if (err instanceof BaseError) {
      return res.status(err.statusCode).send(err.message);
    }
    next(err);
  }
}

export async function updateProjectAssociation(req, res, next) {
  const { body } = req;

  const projectId = parseInt(body.projectId);
  const memberId = parseInt(body.memberId);

  let association = {
    ...body,
    projectId,
    memberId,
  };

  const joiValidation = updateProjectAssociationSchema.validate(association);

  if (joiValidation.error) {
    const typeError = joiValidation.error.details[0].type;
    if (typeError === "object.unknown") {
      return res.status(422).send(joiValidation.error.details[0].message);
    }
    return res.status(400).send(joiValidation.error.details[0].message);
  }

  if (body.startDate) {
    const startDate = new Date(dateToIso(body.startDate));
    association = {
      ...association,
      startDate,
    };
  }
  if (body.endDate) {
    const endDate = new Date(dateToIso(body.endDate));
    association = {
      ...association,
      endDate,
    };
  }

  try {
    const projectAssociation = await projectAssociationService.updateProjectAssociation(body);
    return res.status(200).send(projectAssociation);
  } catch (err) {
    if (err instanceof BaseError) {
      return res.status(err.statusCode).send(err.message);
    }
    next(err);
  }
}
