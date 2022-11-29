import { faker } from "@faker-js/faker";
import RandExp from "randexp";
import { isProjectActive } from "../../src/services/projectService";

export function createValidProject({
  name,
  creationDate,
  endDate,
  building,
  room,
  embrapii_code,
  financier,
} = {}) {
  return {
    name: name || faker.company.bsNoun(),
    creationDate: creationDate || faker.date.past(),
    endDate: endDate || faker.date.future(),
    building: building || faker.address.country(),
    room: room || faker.address.secondaryAddress(),
    embrapii_code: embrapii_code || new RandExp(/[0-9]{11}/).gen(),
    financier: financier || faker.company.name(),
  };
}

export function createValidProjectWithoutEndDate({
  name,
  creationDate,
  building,
  room,
  embrapii_code,
  financier,
} = {}) {
  return {
    name: name || faker.company.bsNoun(),
    creationDate: creationDate || faker.date.past(),
    building: building || faker.address.country(),
    room: room || faker.address.secondaryAddress(),
    embrapii_code: embrapii_code || new RandExp(/[0-9]{11}/).gen(),
    financier: financier || faker.company.name(),
  };
}

export function createValidProjectWithoutCreationDate({
  name,
  endDate,
  building,
  room,
  embrapii_code,
  financier,
} = {}) {
  return {
    name: name || faker.company.bsNoun(),
    endDate: endDate || faker.date.future(),
    building: building || faker.address.country(),
    room: room || faker.address.secondaryAddress(),
    embrapii_code: embrapii_code || new RandExp(/[0-9]{11}/).gen(),
    financier: financier || faker.company.name(),
  };
}

export function createValidProjectWithoutEndDateWithId({ id, isActive, ...props }) {
  return { id, isActive, ...createValidProjectWithoutEndDate({ ...props }) };
}

export function createValidProjectWithoutCreationDateWithId({ id, isActive, ...props }) {
  return { id, isActive, ...createValidProjectWithoutCreationDate({ ...props }) };
}

export function createValidProjectWithId({ id, isActive, ...props }) {
  return { id, isActive, ...createValidProject({ ...props }) };
}
