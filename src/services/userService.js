import { insertUser } from "../repositories/userRepository";

async function createUser({ name, email, password }) {
  return insertUser({ name, email, password });
}

export { createUser };
