import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import RandExp from "randexp";

export function createValidProjectAssociation({ projectId, memberId, startDate, endDate } = {}) {
  return {
    projectId: projectId ?? new RandExp(/[0-9]{2}/).gen(),
    memberId: memberId ?? new RandExp(/[0-9]{2}/).gen(),
    startDate: startDate ?? dayjs(faker.date.past(1)).toDate(),
    endDate: endDate ?? dayjs(faker.date.future(1)).toDate(),
  };
}
