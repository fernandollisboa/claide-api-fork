import { faker } from "@faker-js/faker";

export function createValidService({ name } = {}) {
  return {
    name: name ?? faker.internet.domainName(),
  };
}

export function createValidServiceWithId({ id, ...props } = {}) {
  return { id: id ?? faker.datatype.number(), ...createValidService({ ...props }) };
}
