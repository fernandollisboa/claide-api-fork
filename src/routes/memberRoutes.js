import { Router } from "express";
import {
  createMember,
  getMemberById,
  getAllMembers,
  updateMember,
  deleteMember,
} from "../controllers/memberController";

const memberRouter = Router();

memberRouter.post("/", createMember);
memberRouter.get("/:id", getMemberById);
memberRouter.get("/", getAllMembers);
memberRouter.put("/", updateMember);
memberRouter.delete("/:id", deleteMember);

export default memberRouter;
