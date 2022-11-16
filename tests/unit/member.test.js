import { jest } from "@jest/globals";
import { faker } from "@faker-js/faker";
import * as memberService from "../../src/services/memberService";
import * as memberRepository from "../../src/repositories/memberRepository";
import { createValidMember } from "../factories/memberFactory";

describe("member service", () => {
  describe("insert funcion", () => {
    describe("given the member data is valid", () => {
      it("should create a new member", async () => {
        const validMember = createValidMember();

        jest.spyOn(memberRepository, "getMemberByCpf").mockResolvedValueOnce(null);
        jest.spyOn(memberRepository, "getMemberByRg").mockResolvedValueOnce(null);
        jest.spyOn(memberRepository, "getMemberByPassport").mockResolvedValueOnce(null);
        jest.spyOn(memberRepository, "getMemberBySecondaryEmail").mockResolvedValueOnce(null);
        jest.spyOn(memberRepository, "insertMember").mockImplementationOnce(() => {
          return [{ id: faker.datatype.uuid(), ...validMember }];
        });

        const result = await memberService.createMember(validMember);

        expect(result.length > 0).toBeTruthy();
      });
    });
    describe("given the member's cpf is already taken", () => {
      it("should not allow to create a duplicate", async () => {
        expect.assertions(2);
        const duplicateCpfMember = createValidMember({ cpf: "123456789098" });

        jest.spyOn(memberRepository, "getMemberByCpf").mockResolvedValueOnce(duplicateCpfMember);

        const result = memberService.createMember(duplicateCpfMember);

        await expect(result).rejects.toThrow(Error);
        expect(result).rejects.toHaveProperty("message", "Already exists a Member with this cpf");
      });
    });

    describe("given the member's rg is already taken", () => {
      it("should not allow to create a duplicate", async () => {
        expect.assertions(2);
        const duplicateRgMember = createValidMember({ rg: "123456789098" });

        jest.spyOn(memberRepository, "getMemberByRg").mockResolvedValueOnce(duplicateRgMember);

        const result = memberService.createMember(duplicateRgMember);

        await expect(result).rejects.toThrow(Error);
        expect(result).rejects.toHaveProperty("message", "Already exists a Member with this RG");
      });
    });

    describe("given the member's passport number is already taken", () => {
      it("should not allow to create a duplicate", async () => {
        expect.assertions(2);
        const duplicatePassportMember = createValidMember({ passport: "FG1542685" });

        jest
          .spyOn(memberRepository, "getMemberByPassport")
          .mockResolvedValueOnce(duplicatePassportMember);

        const result = memberService.createMember(duplicatePassportMember);

        await expect(result).rejects.toThrow(Error);
        expect(result).rejects.toHaveProperty(
          "message",
          "Already exists a Member with this passport"
        );
      });
    });
    describe("given the member's secondary email is already taken", () => {
      it("should not allow to create a duplicate", async () => {
        expect.assertions(2);
        const mockEmail = faker.internet.email();
        const duplicateEmailMember = createValidMember({ secondaryEmail: mockEmail });

        jest
          .spyOn(memberRepository, "getMemberBySecondaryEmail")
          .mockResolvedValueOnce(duplicateEmailMember);

        const result = memberService.createMember(duplicateEmailMember);

        await expect(result).rejects.toThrow(Error);
        expect(result).rejects.toHaveProperty(
          "message",
          "Already exists a Member with this secondary email"
        );
      });
    });
    describe("given the member's age is fewer than 15", () => {
      it("should not allow to create a new member, because he/she is too young", async () => {
        expect.assertions(2);
        const mockBirthDate = "11/11/2010";
        const tooYoungMember = createValidMember({ birthDate: mockBirthDate });

        jest.spyOn(memberRepository, "getMemberByCpf").mockResolvedValueOnce(null);
        jest.spyOn(memberRepository, "getMemberByRg").mockResolvedValueOnce(null);
        jest.spyOn(memberRepository, "getMemberByPassport").mockResolvedValueOnce(null);
        jest.spyOn(memberRepository, "getMemberBySecondaryEmail").mockResolvedValueOnce(null);
        jest.spyOn(memberRepository, "insertMember").mockImplementationOnce(() => {
          return [{ id: faker.datatype.uuid(), ...validMember }];
        });

        const result = memberService.createMember(tooYoungMember);

        await expect(result).rejects.toThrow(Error);
        expect(result).rejects.toHaveProperty(
          "message",
          "Invalid date, the member must have more than 15 years!"
        );
      });
    });
  });
});
