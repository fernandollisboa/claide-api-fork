/* eslint-disable no-unused-vars */
import jwt from "jsonwebtoken";
import { faker } from "@faker-js/faker";

import UserUnauthorizedOrNotFoundError from "../errors/UserUnauthorizedOrNotFoundError";

/**
 * Mocks the authentication of a user by ldap, should only be used in test environment
 * @author @fenandollisboa
 * @param {string} username
 * @param {string} password
 * @returns {object} {jwToken, roles, id, username}
 */
export default function mockAuthenticateUser({ username, password }) {
  const id = faker.datatype.uuid();
  if (username === "NOT_FOUND") throw new UserUnauthorizedOrNotFoundError(username);
  if (username === "ERROR") throw new Error("Buuu!");
  const roles = ["SUPPORT", "RECEPTIONIST", "PROFESSOR"];
  const jwToken = jwt.sign({ id, username, roles }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
  return { jwToken, roles, id, username };
}
