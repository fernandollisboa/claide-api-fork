import { Router } from "express";
import * as memberController from "../controllers/memberController";
import auth from "../middlewares/auth";

const memberRouter = Router();

memberRouter.post("/", auth, memberController.createMember);
memberRouter.get("/:id", auth, memberController.getMemberById);
memberRouter.get("/", memberController.getAllMembers);
memberRouter.put("/", auth, memberController.updateMember);
memberRouter.delete("/:id", auth, memberController.deleteMember);

export default memberRouter;
