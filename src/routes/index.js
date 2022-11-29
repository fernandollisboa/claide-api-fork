import { Router } from "express";

import memberRouter from "./memberRoutes";
import projectsRouter from "./projectsRouter";
import authRouter from "./authRoutes";
import errorMiddleware from "../middlewares/errorMiddleware";
import auth from "../middlewares/authMiddleware";

const routes = Router();

routes.use("/login", authRouter);

routes.use("/members", auth, memberRouter);
routes.use("/projects", auth, projectsRouter);
routes.use(errorMiddleware);

export default routes;
