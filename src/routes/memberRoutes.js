import { Router } from "express";
import {
  createMember,
  getMemberById,
  getAllMembers,
  updateMember,
} from "../controllers/memberController";
import validateSchema from "../middlewares/schemaValidationMiddleware";
import { createMemberSchema, updateMemberSchema } from "../schemas/membersSchema";

const memberRouter = Router();

memberRouter.post("/", validateSchema(createMemberSchema), createMember);
memberRouter.get("/:id", getMemberById);
memberRouter.get("/", getAllMembers);
memberRouter.put("/", validateSchema(updateMemberSchema), updateMember);

export default memberRouter;
