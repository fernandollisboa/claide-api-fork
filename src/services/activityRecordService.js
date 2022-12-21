import * as activityRepository from "../repositories/activityRecordRepository";

export async function createActivity(activity) {
  const newActivity = {
    ...activity,
    date: new Date(),
  };

  return await activityRepository.insertActivity(newActivity);
}

export async function getActivities() {
  return activityRepository.findAll();
}
