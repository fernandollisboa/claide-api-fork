import { Router } from "express";
import * as userController from "../controllers/userController";
import * as loginController from "../controllers/loginController";

const routes = Router();

routes.post("/signup", userController.createUser);
routes.post("/login", loginController.login);

export default routes;
