import { Router } from "express";
import { getActivities } from "../controllers/activityRecordController";

const activitiesRouter = Router();

activitiesRouter.get("/", getActivities);

export default activitiesRouter;
