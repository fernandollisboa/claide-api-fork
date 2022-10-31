import { Router } from "express";
import * as userController from "../controllers/userController";
import * as personController from "../controllers/personController";

const routes = Router();

routes.post("/signup", userController.createUser);
routes.post("/createPerson", personController.createPerson);

export default routes;
