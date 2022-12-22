import * as activityService from "../services/activityRecordService";

export async function getActivities(req, res) {
  const activities = await activityService.getActivities();
  return res.status(201).send(activities);
}
