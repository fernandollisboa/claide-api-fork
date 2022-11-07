import { createProjectSchema } from "../schemas/createProjectSchema";
import * as projectService from "../services/projectService";

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
  const projects = await projectService.findAll();

  return res.status(200).send(projects);
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
