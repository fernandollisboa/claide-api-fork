import { Router } from "express";
import * as userController from "../controllers/userController";
import projectsRouter from "./projectsRouter";

const routes = Router();

routes.post("/signup", userController.createUser);
routes.use("/projects", projectsRouter);

export default routes;
