import { Router } from "express";
import * as userController from "../controllers/userController";

const routes = Router();

routes.post("/signup", userController.createUser);

export default routes;
