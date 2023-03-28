import { Router } from "express";
import * as swaggerUi from "swagger-ui-express";

import memberRouter from "./memberRoutes";
import projectsRouter from "./projectsRouter";
import authRouter from "./authRoutes";
import errorMiddleware from "../middlewares/errorMiddleware";
import auth from "../middlewares/authMiddleware";
import activitiesRouter from "./activitiesRoutes";

import swaggerFile from "../../swagger/swagger_output";

const routes = Router();

routes.use("/members", auth, memberRouter);
routes.use("/projects", auth, projectsRouter);
routes.use("/activity-records", auth, activitiesRouter);

routes.use("/login", authRouter);

routes.use(errorMiddleware);

routes.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

export default routes;
