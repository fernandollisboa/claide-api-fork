import { Router } from "express";
import * as projectController from "../controllers/projectController";

const projectsRouter = Router();

projectsRouter.post("/", projectController.createProject);
projectsRouter.get("/", projectController.getProjects);
projectsRouter.get("/:id", projectController.getProjectById);
projectsRouter.put("/", projectController.updateProject);

export default projectsRouter;
