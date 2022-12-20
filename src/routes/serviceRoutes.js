import { Router } from "express";

import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  createServiceAssociation,
  getAllServicesAssociations,
  getServiceAssociationByServiceId,
  getServiceAssociationByMemberId,
  deleteAssociation,
} from "../controllers/serviceController";
import {
  createServiceSchema,
  updateServiceSchema,
  createServiceAssociationSchema,
} from "../schemas/serviceSchema";
import validateSchema from "../middlewares/schemaValidationMiddleware";

const serviceRouter = Router();

serviceRouter.post("/", validateSchema(createServiceSchema), createService);
serviceRouter.get("/", getAllServices);
serviceRouter.get("/:serviceId", getServiceById);
serviceRouter.put("/:serviceId", validateSchema(updateServiceSchema), updateService);
serviceRouter.post(
  "/:serviceId/members",
  validateSchema(createServiceAssociationSchema),
  createServiceAssociation
);
serviceRouter.get("/associations/all", getAllServicesAssociations);
serviceRouter.get("/:serviceId/members", getServiceAssociationByServiceId);
serviceRouter.get("/:memberId/services", getServiceAssociationByMemberId);
serviceRouter.delete("/:id", deleteAssociation);

export default serviceRouter;
