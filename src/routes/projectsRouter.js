import { Router } from "express";
import * as projectController from "../controllers/projectController";
import auth from "../middlewares/auth";

const projectsRouter = Router();

projectsRouter.post("/", auth, projectController.createProject);
projectsRouter.get("/", auth, projectController.getProjects);
projectsRouter.get("/:id", auth, projectController.getProjectById);
projectsRouter.put("/", auth, projectController.updateProject);

export default projectsRouter;
