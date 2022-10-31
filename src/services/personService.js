import { insertPerson } from "../repositories/personRepository";

async function createPerson({ name, email, password }) {
  return insertPerson({ name, email, password });
}

export { createPerson };
