import { Router } from "express";

import memberRouter from "./memberRoutes";
import projectsRouter from "./projectsRouter";
import authRouter from "./authRoutes";
import errorMiddleware from "../middlewares/errorMiddleware";
import auth from "../middlewares/authMiddleware";
import activitiesRouter from "./activitiesRoutes";

const routes = Router();

routes.use("/login", authRouter);

routes.use("/members", auth, memberRouter);
routes.use("/projects", auth, projectsRouter);
routes.use(errorMiddleware);
routes.use("/activityRecords", auth, activitiesRouter);

export default routes;
