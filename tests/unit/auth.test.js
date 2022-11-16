import { jest } from "@jest/globals";
import { faker } from "@faker-js/faker";

describe("auth service", () => {
  describe("given the ldap user exists and its role is valid", () => {
    it("should authenticate succesfully", async () => {
      const validUser = userFactory.createValidUser();

      jest.spyOn();
    });
  });
});
