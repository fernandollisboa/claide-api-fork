import { Router } from "express";

import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  createProjectAssociation,
  getProjectAssociationsByProjectId,
  getProjectAssociationsByProjectIdAndMemberId,
  updateProjectAssociation,
  getProjectAssociationsByMemberId,
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
  "/:projectId/members/:memberId",
  validateSchema(createProjectAssociationSchema),
  createProjectAssociation
);
projectsRouter.get("/:projectId/members", getProjectAssociationsByProjectId);
projectsRouter.get("/members/:memberId/projects", getProjectAssociationsByMemberId);
projectsRouter.get("/:projectId/members/:memberId", getProjectAssociationsByProjectIdAndMemberId);
projectsRouter.put(
  "/:projectId/members/:memberId",
  validateSchema(updateProjectAssociationSchema),
  updateProjectAssociation
);

export default projectsRouter;
