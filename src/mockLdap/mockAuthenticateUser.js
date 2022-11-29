/* eslint-disable no-unused-vars */
import jwt from "jsonwebtoken";
import { faker } from "@faker-js/faker";

import UserUnauthorizedOrNotFoundError from "../errors/UserUnauthorizedOrNotFoundError";

export default async function mockAuthenticateUser({ username, password }) {
  const id = faker.datatype.uuid();
  if (username === "bola") throw new UserUnauthorizedOrNotFoundError(username);
  if (username === "buu") throw new Error("Buuu!");

  const jwToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
  return { username, jwToken };
}