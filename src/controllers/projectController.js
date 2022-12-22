import * as projectService from "../services/projectService";
import * as projectAssociationService from "../services/projectAssociationService";
import { parseBrDateToStandardDate } from "../utils/dateUtils";
import InvalidParamError from "../errors/InvalidParamError";
import BaseError from "../errors/BaseError";

export async function createProject(req, res, next) {
  const { body } = req;
  const { authorization } = req.headers;
  const token = authorization?.split("Bearer ")[1];

  try {
    let { creationDate, endDate } = body;
    creationDate = parseBrDateToStandardDate(creationDate);
    if (endDate) endDate = parseBrDateToStandardDate(endDate);

    const projectData = { ...body, creationDate, endDate };
    const createdProject = await projectService.createProject(projectData, token);

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
  const { authorization } = req.headers;
  const token = authorization?.split("Bearer ")[1];

  try {
    let { creationDate, endDate } = body;
    if (creationDate) creationDate = parseBrDateToStandardDate(creationDate);
    if (endDate) endDate = parseBrDateToStandardDate(endDate);

    const projectData = { ...body, creationDate, endDate };
    const project = await projectService.updateProject(projectData, token);

    return res.status(200).send(project);
  } catch (err) {
    next(err);
  }
}

export async function createProjectAssociation(req, res, next) {
  const { params, body } = req;
  const projectId = Number(params.projectId);
  const memberId = Number(params.memberId);
  const { authorization } = req.headers;
  const token = authorization?.split("Bearer ")[1];

  let association = {
    ...body,
    projectId,
    memberId,
  };

  try {
    const startDate = new Date(parseBrDateToStandardDate(body.startDate));
    association = {
      ...association,
      startDate,
    };
    if (body.endDate) {
      const endDate = new Date(parseBrDateToStandardDate(body.endDate));
      association = {
        ...association,
        endDate,
      };
    }

    const createdProjectAssociation = await projectAssociationService.createProjectAssociation(
      association,
      token
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
  const { projectId: projectIdToken } = req.params;
  const projectId = Number(projectIdToken);

  try {
    if (isNaN(projectId)) {
      throw new InvalidParamError("projectId", projectId);
    }
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
  const { memberId: memberIdToken } = req.params;
  const memberId = Number(memberIdToken);

  try {
    if (isNaN(memberId)) {
      throw new InvalidParamError("memberId", memberId);
    }

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
  const { projectId: projectIdToken } = req.params;
  const projectId = Number(projectIdToken);

  const { memberId: memberIdToken } = req.params;
  const memberId = Number(memberIdToken);

  try {
    if (isNaN(projectId)) {
      throw new InvalidParamError("projectId", projectId);
    }
    if (isNaN(memberId)) {
      throw new InvalidParamError("memberId", memberId);
    }
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
  const { params, body } = req;
  const projectId = Number(params.projectId);
  const memberId = Number(params.memberId);

  const { authorization } = req.headers;
  const token = authorization?.split("Bearer ")[1];

  let association = {
    ...body,
    projectId,
    memberId,
  };

  if (body.startDate) {
    const startDate = new Date(parseBrDateToStandardDate(body.startDate));
    association = {
      ...association,
      startDate,
    };
  }
  if (body.endDate) {
    const endDate = new Date(parseBrDateToStandardDate(body.endDate));
    association = {
      ...association,
      endDate,
    };
  }

  try {
    const projectAssociation = await projectAssociationService.updateProjectAssociation(
      association,
      token
    );
    return res.status(200).send(projectAssociation);
  } catch (err) {
    if (err instanceof BaseError) {
      return res.status(err.statusCode).send(err.message);
    }
    next(err);
  }
}
