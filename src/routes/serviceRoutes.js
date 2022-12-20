import { Router } from "express";
import * as serviceController from "../controllers/serviceController";
import validateSchema from "../middlewares/schemaValidationMiddleware";
import { createServiceSchema, updateServiceSchema } from "../schemas/serviceSchema";
import { createServiceAssociationSchema } from "../schemas/serviceSchema";
// import auth from "../middlewares/auth";

const serviceRouter = Router();

serviceRouter.post("/", validateSchema(createServiceSchema), serviceController.createService);
serviceRouter.get("/", serviceController.getAllServices);
serviceRouter.get("/:serviceId", serviceController.getServiceById);
serviceRouter.put(
  "/:serviceId",
  validateSchema(updateServiceSchema),
  serviceController.updateService
);

serviceRouter.post(
  "/:serviceId/members",
  validateSchema(createServiceAssociationSchema),
  serviceController.createServiceAssociation
);
serviceRouter.get("/associations/all", serviceController.getAllServicesAssociations);
serviceRouter.get("/:serviceId/members", serviceController.getServiceAssociationByServiceId);
serviceRouter.get("/:memberId/services", serviceController.getServiceAssociationByMemberId);
serviceRouter.delete("/:id", serviceController.deleteAssociation);

export default serviceRouter;
