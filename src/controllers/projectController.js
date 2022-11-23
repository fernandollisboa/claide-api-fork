import { createProjectSchema } from "../schemas/createProjectSchema";
import { updateProjectSchema } from "../schemas/updateProjectSchema";
import { createProjectAssociationSchema } from "../schemas/createProjectAssociationSchema";
import { updateProjectAssociationSchema } from "../schemas/updateProjectAssociationSchema";
import * as projectService from "../services/projectService";
import * as projectAssociationService from "../services/projectAssociationService";
import { activeMember } from "../services/memberService";

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
  let order = desc === "true" ? "desc" : "asc";
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

export async function createProjectAssociation(req, res) {
  const { params, body } = req;
  const projectId = parseInt(params.projectId);
  let association = {
    ...body,
    projectId,
  };

  const joiValidation = createProjectAssociationSchema.validate(association);

  if (joiValidation.error) {
    const typeError = joiValidation.error.details[0].type;
    if (typeError === "any.required" || typeError === "object.unknown") {
      return res.status(422).send(joiValidation.error.details[0].message);
    }
    return res.status(400).send(joiValidation.error.details[0].message);
  }

  try {
    await activeMember(body.username);
  } catch (err) {
    return res.status(400).send(err.message);
  }

  let project = await projectService.findById(projectId);
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

export async function getProjectAssociationsByProjectId(req, res) {
  const { params } = req;
  const projectId = parseInt(params.projectId);
  try {
    const associations = await projectAssociationService.findByProjectId(projectId);
    return res.status(200).send(associations);
  } catch (err) {
    return res.status(422).send(err.message);
  }
}

export async function getProjectAssociationsByUsername(req, res) {
  const { params } = req;
  const { username } = params;
  try {
    const associations = await projectAssociationService.findByUsername(username);
    return res.status(200).send(associations);
  } catch (err) {
    return res.status(422).send(err.message);
  }
}

export async function getProjectAssociationsByProjectIdAndUsername(req, res) {
  const { params } = req;
  const projectId = parseInt(params.projectId);
  const { username } = params;
  try {
    const associations = await projectAssociationService.findByProjectIdAndUsername(
      projectId,
      username
    );
    return res.status(200).send(associations);
  } catch (err) {
    return res.status(404).send(err.message);
  }
}

export async function updateProjectAssociation(req, res) {
  const { body } = req;

  const joiValidation = updateProjectAssociationSchema.validate(body);

  if (joiValidation.error) {
    const typeError = joiValidation.error.details[0].type;
    if (typeError === "object.unknown") {
      return res.status(422).send(joiValidation.error.details[0].message);
    }
    return res.status(400).send(joiValidation.error.details[0].message);
  }

  try {
    const projectAssociation = await projectAssociationService.updateProjectAssociation(body);
    return res.status(200).send(projectAssociation);
  } catch (err) {
    res.status(404).send(err.message);
  }
}
