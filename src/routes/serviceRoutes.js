import { Router } from "express";
import * as serviceController from "../controllers/serviceController";
// import auth from "../middlewares/auth";

const serviceRouter = Router();

serviceRouter.post("/", serviceController.createService);
serviceRouter.get("/", serviceController.getAllServices);
serviceRouter.get("/id=:serviceId", serviceController.getServiceById);
serviceRouter.get("/name=:serviceName", serviceController.getServiceByName);

serviceRouter.post("/:serviceId/members", serviceController.createServiceAssociation);
serviceRouter.get("/associations", serviceController.getAllServicesAssociations);
serviceRouter.get("/:serviceId/members", serviceController.getServiceAssociationByServiceId);
serviceRouter.get("/:memberId/services", serviceController.getServiceAssociationByMemberId);
serviceRouter.delete("/:id", serviceController.deleteAssociation);

export default serviceRouter;
