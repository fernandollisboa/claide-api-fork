/* eslint-disable no-unused-vars */
import jwt from "jsonwebtoken";
import { faker } from "@faker-js/faker";

import UserUnauthorizedOrNotFoundError from "../errors/UserUnauthorizedOrNotFoundError";

// Test this function with:
// curl -X POST -H "Content-Type: application/json" -d '{"username":"NOT_FOUND","password":"123"}' http://localhost:3000/login
// curl -X POST -H "Content-Type: application/json" -d '{"username":"ERROR","password":"123"}' https://localhost:3000/login
export default function mockAuthenticateUser({ username, password }) {
  const id = faker.datatype.uuid();
  if (username === "NOT_FOUND") throw new UserUnauthorizedOrNotFoundError(username);
  if (username === "ERROR") throw new Error("Buuu!");
  const roles = ["SUPPORT"];
  const jwToken = jwt.sign({ id, username, roles }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
  return { jwToken, roles, id, username };
}
