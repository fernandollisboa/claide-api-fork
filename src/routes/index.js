import { Router } from "express";
import * as userController from "../controllers/userController";
import * as authController from "../controllers/authController";

const routes = Router();

routes.post("/signup", userController.createUser);
routes.post("/login", authController.login);

export default routes;
