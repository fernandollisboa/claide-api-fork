import { Router } from "express";

import {
  createMember,
  getMemberById,
  getAllMembers,
  updateMember,
} from "../controllers/memberController";
import { getProjectAssociationsByMemberId } from "../controllers/projectController";
import validateSchema from "../middlewares/schemaValidationMiddleware";
import { createMemberSchema, updateMemberSchema } from "../schemas/membersSchema";

const memberRouter = Router();

memberRouter.post("/", validateSchema(createMemberSchema), createMember);
memberRouter.get("/", getAllMembers);
memberRouter.get("/:id", getMemberById);
memberRouter.put("/:id", validateSchema(updateMemberSchema), updateMember);
memberRouter.get("/:memberId/projects", getProjectAssociationsByMemberId);

export default memberRouter;
