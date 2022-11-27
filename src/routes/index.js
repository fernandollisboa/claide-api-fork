import { Router } from "express";
import memberRouter from "./memberRoutes";
import { login } from "../controllers/authController";
import projectsRouter from "./projectsRouter";
import errorMiddleware from "../middlewares/errorMiddleware";

const routes = Router();

routes.use("/members", memberRouter);
routes.use("/projects", projectsRouter);
routes.post("/login", login);
routes.use(errorMiddleware);

export default routes;
