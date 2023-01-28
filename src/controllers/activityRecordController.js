import * as activityService from "../services/activityRecordService";
import invalidAtributeError from "../errors/InvalidAtributeError";
export async function getActivities(req, res,next) {
	const {operation,entity,desc} = req.query;
	let order,operationUpperCase,entityUpperCase;
	if (desc){
		order = desc === "true" ? "desc" : "asc";
	}
	try{
		if (operation){
			operationUpperCase = operation.toUpperCase();
			if(!(["CREATE","UPDATE"].includes(operationUpperCase))){
				throw new invalidAtributeError("operation",operationUpperCase);
			}
		}
		if (entity){
			entityUpperCase = entity.toUpperCase();
			if(!(["PROJECT","MEMBER","SERVICE","UPDATE","PROJECT_ASSOCIATION","SERVICE_ASSOCIATION"]).includes(entityUpperCase)){
				throw new invalidAtributeError("entity",entityUpperCase);
			}
		}
	
		const activities = await activityService.getActivities({operationUpperCase,entityUpperCase,order});
		return res.status(201).send(activities);    
	}catch(err){
		next(err);
	}
}
