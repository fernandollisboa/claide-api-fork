import * as activityRepository from "../repositories/activityRecordRepository";
import { getDifference } from "../utils/activityRecordUtils";

export async function createActivity(activity) {
	let {oldValue,newValue} = activity;
	
	if(oldValue && newValue){
		const {oldValueChanged,newValueChanged} = getDifference(oldValue,newValue);		
		oldValue = oldValueChanged;
		newValue = newValueChanged;
	}

	const newActivity = {
		...activity,
		oldValue,
		newValue,
		date: new Date(),
	};
	console.log("oieee");
	console.log(newActivity);

	return await activityRepository.insertActivity(newActivity);
}

export async function getActivities({operationUpperCase,entityUpperCase,order}) {
	return activityRepository.findAll({operationUpperCase,entityUpperCase,order});
}
