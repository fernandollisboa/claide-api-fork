import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import RandExp from "randexp";

export function createValidProjectAssociation({ projectId, memberId, startDate, endDate } = {}) {
  return {
    projectId: projectId ?? new RandExp(/[0-9]{2}/).gen(),
    memberId: memberId ?? new RandExp(/[0-9]{2}/).gen(),
    startDate:
      startDate ??
      new Date(dayjs(faker.date.past(1, "2022-01-01T00:00:00.000Z")).format("MM/DD/YYYY")),
    endDate:
      endDate ??
      new Date(dayjs(faker.date.future(1, "2022-01-01T00:00:00.000Z")).format("MM/DD/YYYY")),
  };
}
