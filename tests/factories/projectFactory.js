import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import RandExp from "randexp";

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
    creationDate: creationDate || faker.date.past(7),
    endDate: endDate || faker.date.future(2),
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
    creationDate: creationDate || faker.date.past(7),
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
    endDate: endDate || faker.date.future(2),
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
