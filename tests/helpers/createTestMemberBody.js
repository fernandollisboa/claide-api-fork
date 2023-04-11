/* eslint-disable no-param-reassign */
import { createValidMember } from "../factories/memberFactory";
import { faker } from "@faker-js/faker";

export function createTestMemberBody(memberData = {}) {
  const services = memberData.services ?? [];
  const member = createValidMember(memberData);
  delete member.registrationStatus;

  const body = {
    ...member,
    services,
    birthDate: memberData.birthDate ?? faker.date.birthdate({ mode: "age" }).toISOString(),
  };
  return body;
}
