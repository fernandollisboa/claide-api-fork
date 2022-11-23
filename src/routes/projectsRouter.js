import { Router } from "express";
import * as projectController from "../controllers/projectController";
import auth from "../middlewares/auth";

const projectsRouter = Router();

projectsRouter.post("/", auth, projectController.createProject);
projectsRouter.get("/", auth, projectController.getProjects);
projectsRouter.get("/:id", auth, projectController.getProjectById);
projectsRouter.put("/", auth, projectController.updateProject);
projectsRouter.post("/:projectId/members", auth, projectController.createProjectAssociation);
projectsRouter.get(
  "/:projectId/members",
  auth,
  projectController.getProjectAssociationsByProjectId
);
projectsRouter.get(
  "/:projectId/members/:username",
  auth,
  projectController.getProjectAssociationsByProjectIdAndUsername
);
projectsRouter.put("/members", auth, projectController.updateProjectAssociation);

export default projectsRouter;
