import { Router } from "express";

import {
  createMember,
  getMemberById,
  getAllMembers,
  updateMember,
  setStatusRegistration,
} from "../controllers/memberController";
import { getProjectAssociationsByMemberId } from "../controllers/projectController";
import validateSchema from "../middlewares/schemaValidationMiddleware";
import {
  createMemberSchema,
  updateMemberSchema,
  setStatusRegistrationSchema,
} from "../schemas/membersSchema";

const memberRouter = Router();

memberRouter.post("/", validateSchema(createMemberSchema), createMember);
memberRouter.get("/", getAllMembers);
memberRouter.get("/:id", getMemberById);
memberRouter.put("/:id", validateSchema(updateMemberSchema), updateMember);
memberRouter.get("/:memberId/projects", getProjectAssociationsByMemberId);
memberRouter.put(
  "/set-status-registration/:id",
  validateSchema(setStatusRegistrationSchema),
  setStatusRegistration
);

export default memberRouter;
