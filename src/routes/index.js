import { Router } from "express";
import * as userController from "../controllers/userController";
import * as projectController from "../controllers/projectController";

const routes = Router();

routes.post("/signup", userController.createUser);
routes.post("/project", projectController.createProject);
routes.get("/project", projectController.getProjects);
routes.get("/project/:id", projectController.getProjectById);

export default routes;
