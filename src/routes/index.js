import { Router } from "express";

import memberRouter from "./memberRoutes";
import projectsRouter from "./projectsRouter";
import authRouter from "./authRoutes";
import errorMiddleware from "../middlewares/errorMiddleware";

import mockAuth from "../mockLdap/mockAuth";

const routes = Router();

routes.use("/login", authRouter);
routes.use("/members", mockAuth, memberRouter);
routes.use("/projects", mockAuth, projectsRouter);
routes.use(errorMiddleware);

export default routes;
