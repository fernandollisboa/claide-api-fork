import { Router } from "express";
import * as serviceController from "../controllers/serviceController";
// import auth from "../middlewares/auth";

const serviceRouter = Router();

serviceRouter.post("/", serviceController.createService);
serviceRouter.get("/", serviceController.getAllServices);

export default serviceRouter;
