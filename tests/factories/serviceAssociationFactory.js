import { faker } from "@faker-js/faker";

export function createValidServiceAssociation({ serviceId, memberId } = {}) {
  return {
    serviceId: serviceId ?? faker.datatype.uuid(),
    memberId: memberId ?? faker.datatype.uuid(),
  };
}

export function createValidServiceAssociationWithId({ id, ...props } = {}) {
  return { id: id ?? faker.datatype.number(), ...createValidServiceAssociation({ ...props }) };
}
