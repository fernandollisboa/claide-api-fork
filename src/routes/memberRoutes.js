import { Router } from "express";
import * as memberController from "../controllers/memberController";

const memberRouter = Router();

memberRouter.post("/createMember", memberController.createMember);
memberRouter.get("/member=:id", memberController.getMemberById);
memberRouter.get("/", memberController.getAllMembers);
memberRouter.put("/editMember", memberController.updateMember);
memberRouter.delete("/deleteMember=:id", memberController.deleteMember);

export default memberRouter;
