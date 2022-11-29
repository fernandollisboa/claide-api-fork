import { Router } from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  createProjectAssociation,
  getProjectAssociationsByProjectId,
  getProjectAssociationsByProjectIdAndUsername,
  updateProjectAssociation,
} from "../controllers/projectController";
import validateSchema from "../middlewares/schemaValidationMiddleware";
import createProjectAssociationSchema from "../schemas/createProjectAssociationSchema";
import createProjectSchema from "../schemas/createProjectSchema";
import updateProjectAssociationSchema from "../schemas/updateProjectAssociationSchema";
import updateProjectSchema from "../schemas/updateProjectSchema";

const projectsRouter = Router();

projectsRouter.post("/", validateSchema(createProjectSchema), createProject);
projectsRouter.get("/", getAllProjects);
projectsRouter.get("/:id", getProjectById);
projectsRouter.put("/", validateSchema(updateProjectSchema), updateProject);
projectsRouter.post(
  "/:projectId/members",
  validateSchema(createProjectAssociationSchema),
  createProjectAssociation
);
projectsRouter.get("/:projectId/members", getProjectAssociationsByProjectId);
//TO-DO verificar se é isso mesmo aqui embaixo, normalmente se utilizaria /members/:memberId
projectsRouter.get("/:projectId/members/:username", getProjectAssociationsByProjectIdAndUsername);
projectsRouter.put(
  "/members",
  validateSchema(updateProjectAssociationSchema),
  updateProjectAssociation
);

export default projectsRouter;
