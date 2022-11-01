import { Router } from "express";
import * as userController from "../controllers/userController";
import * as memberController from "../controllers/memberController";

const routes = Router();

routes.post("/signup", userController.createUser);
routes.post("/createMember", memberController.createMember);
routes.post("/?id", memberController.getMember);
routes.post("/deleteMember?id", memberController.deleteMember);

export default routes;
