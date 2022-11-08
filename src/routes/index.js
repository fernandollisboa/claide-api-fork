import { Router } from "express";
import * as userController from "../controllers/userController";
import memberRouter from "./memberRoutes";

const routes = Router();

routes.post("/signup", userController.createUser);
routes.use("/members", memberRouter);

export default routes;
