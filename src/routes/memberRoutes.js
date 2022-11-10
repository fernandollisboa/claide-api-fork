import { Router } from "express";
import * as memberController from "../controllers/memberController";

const memberRouter = Router();

memberRouter.post("/", memberController.createMember);
memberRouter.get("/:id", memberController.getMemberById);
memberRouter.get("/", memberController.getAllMembers);
memberRouter.put("/", memberController.updateMember);
memberRouter.delete("/:id", memberController.deleteMember);

export default memberRouter;
