import { jest } from "@jest/globals";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";

import * as memberService from "../../src/services/memberService";
import * as memberRepository from "../../src/repositories/memberRepository";
import { createValidMember, createValidMemberWithId } from "../factories/memberFactory";
import { dateToIso } from "../../src/utils/dateUtils";
import MemberTooYoungError from "../../src/errors/MemberTooYoungError";

const MINIMUM_REQUIRED_AGE = 15;

describe("member service", () => {
  describe("insert function", () => {
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

        const result = memberService.createMember(validMember);

        expect(result).resolves.toMatchObject([validMember]);
      });
    });

    describe("given the member's cpf is already taken", () => {
      it("should not allow to create a duplicate", async () => {
        expect.assertions(2);
        const duplicateCpfMember = createValidMemberWithId({ cpf: "123456789098" });

        jest.spyOn(memberRepository, "getMemberByCpf").mockResolvedValueOnce(duplicateCpfMember);
        
        const result = memberService.createMember(duplicateCpfMember);

        
        console.log(duplicateCpfMember.id !== result.id + `${result.id} e ${duplicateCpfMember.id}`)

        await expect(result).rejects.toThrow(Error);
        expect(result).rejects.toHaveProperty("message", "Already exists a Member with this cpf");
      });
    });

    describe("given the member's rg is already taken", () => {
      it("should not allow to create a duplicate", async () => {
        expect.assertions(2);
        const duplicateRgMember = createValidMemberWithId({ rg: "123456789098" });

        jest.spyOn(memberRepository, "getMemberByRg").mockResolvedValueOnce(duplicateRgMember);

        const result = memberService.createMember(duplicateRgMember);

        await expect(result).rejects.toThrow(Error);
        expect(result).rejects.toHaveProperty("message", "Already exists a Member with this RG");
      });
    });

    describe("given the member's passport number is already taken", () => {
      it("should not allow to create a duplicate", async () => {
        expect.assertions(2);
        const duplicatePassportMember = createValidMemberWithId({ passport: "FG1542685" });

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
        const duplicateEmailMember = createValidMemberWithId({ secondaryEmail: mockEmail });

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

    describe(`given member is younger than ${MINIMUM_REQUIRED_AGE}`, () => {
      it("should not allow to create a new member, because he/she is too young", async () => {
        expect.assertions(2);
        const now = dayjs();
        const mockBirthDate = now
          .subtract(MINIMUM_REQUIRED_AGE, "years")
          .subtract(1, "day")
          .format("DD/MM/YYYY");

        const tooYoungMember = createValidMember({ birthDate: mockBirthDate });

        const result = memberService.createMember(tooYoungMember);

        await expect(result).rejects.toThrow(MemberTooYoungError);
        expect(result).rejects.toHaveProperty("message", new MemberTooYoungError().message);
      });
    });
  });

  describe("getMemberById function", () => {
    describe("given the member's id is valid", () => {
      it("should return the member's data", async () => {
        expect.assertions(3);
        const memberGeneratedId = faker.datatype.uuid();
        const validMemberWithId = createValidMemberWithId({ id: memberGeneratedId });

        jest.spyOn(memberRepository, "getMemberById").mockImplementationOnce(() => {
          return validMemberWithId;
        });

        const result = await memberService.getMemberById(memberGeneratedId);

        expect(memberRepository.getMemberById).toBeCalledTimes(1);
        expect(memberRepository.getMemberById).toBeCalledWith(memberGeneratedId);
        expect(result).toEqual(validMemberWithId);
      });
    });
    describe("given member's id is not found", () => {
      it("should not allow to get an inexistent member", async () => {
        expect.assertions(3);
        const memberInvalidId = faker.datatype.uuid();

        jest.spyOn(memberRepository, "getMemberById").mockResolvedValueOnce();
        const result = memberService.getMemberById(memberInvalidId);

        expect(memberRepository.getMemberById).toBeCalledWith(memberInvalidId);
        expect(result).rejects.toThrow(Error);
        expect(result).rejects.toHaveProperty("message", `Member with Id: ${memberInvalidId} not found`);
      });
    });
  });
  describe("getAllMembers function", () => {
    describe("given getAllMembers is called", () => {
      it("should return all members created", async () => {
        expect.assertions(3);
        const memberGeneratedId = faker.datatype.uuid();
        const validMemberWithId = createValidMemberWithId({ id: memberGeneratedId });
        const memberGeneratedId2 = faker.datatype.uuid();
        const validMemberWithId2 = createValidMemberWithId({ id: memberGeneratedId2 });

        jest
          .spyOn(memberRepository, "getAllMembers")
          .mockImplementationOnce(() => [validMemberWithId, validMemberWithId2]);
        const result = await memberService.getAllMembers();

        expect(memberRepository.getAllMembers).toBeCalledTimes(1);
        expect(memberRepository.getAllMembers).toBeCalledWith(undefined,undefined);
        expect(result).toEqual([validMemberWithId, validMemberWithId2]);
      });
    });
  });

  describe("updateMember function", () => {
    const existingMember = createValidMemberWithId();
    const newMember = createValidMemberWithId(); // TO-DO tirar ID

    jest.spyOn(memberRepository, "getMemberById").mockResolvedValue(existingMember);
    jest.spyOn(memberRepository, "getMemberByCpf").mockResolvedValue(null);
    jest.spyOn(memberRepository, "getMemberByRg").mockResolvedValue(null);
    jest.spyOn(memberRepository, "getMemberByPassport").mockResolvedValue(null);
    jest.spyOn(memberRepository, "getMemberBySecondaryEmail").mockResolvedValue(null);

    describe("given member's data is duplicated", () => {
      it("should not update member's cpf", async () => {
        expect.assertions(2);
        jest.spyOn(memberRepository, "getMemberByCpf").mockResolvedValueOnce(existingMember);

        const result = memberService.updateMember(newMember);

        await expect(result).rejects.toThrow(Error);
        expect(result).rejects.toHaveProperty("message", "Already exists a Member with this cpf");
      });

      it("should not update member's rg", async () => {
        expect.assertions(2);
        jest.spyOn(memberRepository, "getMemberByRg").mockResolvedValueOnce(existingMember);

        const result = memberService.updateMember(newMember);

        await expect(result).rejects.toThrow(Error);
        expect(result).rejects.toHaveProperty("message", "Already exists a Member with this RG");
      });

      it("should not update member's passport", async () => {
        expect.assertions(2);
        jest.spyOn(memberRepository, "getMemberByPassport").mockResolvedValueOnce(existingMember);

        const result = memberService.updateMember(newMember);

        await expect(result).rejects.toThrow(Error);
        expect(result).rejects.toHaveProperty(
          "message",
          "Already exists a Member with this passport"
        );
      });

      it("should not update member's secondary email", async () => {
        expect.assertions(2);
        jest
          .spyOn(memberRepository, "getMemberBySecondaryEmail")
          .mockResolvedValueOnce(existingMember);

        const result = memberService.updateMember(newMember);

        await expect(result).rejects.toThrow(Error);
        expect(result).rejects.toHaveProperty(
          "message",
          "Already exists a Member with this secondary email"
        );
      });
    });

    describe("given member's documents are invalid", () => {
      it("should not update as a brazilian with empty rg", async () => {
        expect.assertions(2);
        const brazilianInvalidMember = createValidMemberWithId({
          id: existingMember.id,
          isBrazilian: true,
          rg: "   ",
        });

        const result = memberService.updateMember(brazilianInvalidMember);

        await expect(result).rejects.toThrow(Error);
        expect(result).rejects.toHaveProperty("message", "A brazilian must have cpf or rg");
      });

      it("should not update as a brazilian with empty cpf", async () => {
        expect.assertions(2);
        const brazilianInvalidMember = createValidMemberWithId({
          id: existingMember.id,
          isBrazilian: true,
          cpf: "",
        });

        const result = memberService.updateMember(brazilianInvalidMember);

        await expect(result).rejects.toThrow(Error);
        expect(result).rejects.toHaveProperty("message", "A brazilian must have cpf or rg");
      });

      it("should not update as a foreigner", async () => {
        expect.assertions(2);
        const foreignInvalidMember = createValidMemberWithId({
          id: existingMember.id,
          isBrazilian: false,
          passport: "   ",
        });

        const result = memberService.updateMember(foreignInvalidMember);

        await expect(result).rejects.toThrow(Error);
        expect(result).rejects.toHaveProperty("message", "A foreigner must have a passport");
      });
    });

    describe("given member is too young", () => {
      it("should not allow to update member's age", async () => {
        expect.assertions(2);
        const mockBirthDate = dayjs()
          .subtract(MINIMUM_REQUIRED_AGE, "years")
          .subtract(1, "day")
          .format("DD/MM/YYYY");
        const tooYoungMember = createValidMemberWithId({
          id: existingMember.id,
          birthDate: mockBirthDate,
        });

        const result = memberService.updateMember(tooYoungMember);

        await expect(result).rejects.toThrow(MemberTooYoungError);
        expect(result).rejects.toHaveProperty("message", new MemberTooYoungError().message);
      });
    });

    describe("given member data is valid", () => {
      it("should call update function", async () => {
        expect.assertions(3);

        jest.spyOn(memberRepository, "updateMember").mockImplementationOnce(() => newMember);

        const result = memberService.updateMember(newMember);

        const formatedBirthDate = new Date(dateToIso(newMember.birthDate));

        await expect(result).resolves.toEqual(newMember);
        expect(memberRepository.updateMember).toBeCalledTimes(1);
        expect(memberRepository.updateMember).toBeCalledWith({
          ...newMember,
          birthDate: formatedBirthDate,
        });
      });
    });
  });
});
