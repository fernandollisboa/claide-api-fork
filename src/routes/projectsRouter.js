import { Router } from "express";
import * as projectController from "../controllers/projectController";
import auth from "../middlewares/auth";

const projectsRouter = Router();

projectsRouter.post("/", auth, projectController.createProject);
projectsRouter.get("/", auth, projectController.getProjects);
projectsRouter.get("/:id", auth, projectController.getProjectById);
projectsRouter.put("/", auth, projectController.updateProject);
projectsRouter.post(
  "/:projectId/members/:memberId",
  auth,
  projectController.createProjectAssociation
);
projectsRouter.get(
  "/:projectId/members",
  auth,
  projectController.getProjectAssociationsByProjectId
);
projectsRouter.get("/members/:memberId", auth, projectController.getProjectAssociationsByMemberId);
projectsRouter.get(
  "/:projectId/members/:memberId",
  auth,
  projectController.getProjectAssociationsByProjectIdAndMemberId
);
projectsRouter.put("/members", auth, projectController.updateProjectAssociation);

export default projectsRouter;
