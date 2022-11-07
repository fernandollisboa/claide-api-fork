import { Router } from "express";
import * as userController from "../controllers/userController";
import * as authController from "../controllers/authController";
import projectsRouter from "./projectsRouter";

const routes = Router();

routes.post("/signup", userController.createUser);
routes.post("/login", authController.login);
routes.use("/projects", projectsRouter);

export default routes;
