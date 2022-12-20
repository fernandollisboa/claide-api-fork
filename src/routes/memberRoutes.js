import { Router } from "express";

import {
  createMember,
  getMemberById,
  getAllMembers,
  updateMember,
  deleteMember,
} from "../controllers/memberController";
import validateSchema from "../middlewares/schemaValidationMiddleware";
import { createMemberSchema, updateMemberSchema } from "../schemas/membersSchema";

const memberRouter = Router();

memberRouter.post("/", validateSchema(createMemberSchema), createMember);
memberRouter.get("/", getAllMembers);
memberRouter.get("/:id", getMemberById);
memberRouter.put("/", validateSchema(updateMemberSchema), updateMember);
memberRouter.delete("/:id", deleteMember);

export default memberRouter;
