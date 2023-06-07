import { Router } from "express";
import { login } from "../controllers/authController";
import validateSchema from "../middlewares/schemaValidationMiddleware";
import loginSchema from "../schemas/authSchema";

const authRouter = Router();

authRouter.post("/", validateSchema(loginSchema), login);

export default authRouter;
