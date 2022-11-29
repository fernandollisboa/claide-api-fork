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
// import auth from "../middlewares/auth";
import auth from "../mockLdap/mockAuth";

const projectsRouter = Router();

projectsRouter.post("/", auth, createProject);
projectsRouter.get("/", auth, getAllProjects);
projectsRouter.get("/:id", auth, getProjectById);
projectsRouter.put("/", auth, updateProject);
projectsRouter.post("/:projectId/members", auth, createProjectAssociation);
projectsRouter.get("/:projectId/members", auth, getProjectAssociationsByProjectId);
projectsRouter.get(
  "/:projectId/members/:username",
  auth,
  getProjectAssociationsByProjectIdAndUsername
);
projectsRouter.put("/members", auth, updateProjectAssociation);

export default projectsRouter;
