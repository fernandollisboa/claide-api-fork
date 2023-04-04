import { describe, it, expect, jest } from "@jest/globals";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";

import * as memberService from "../../src/services/memberService";
import * as memberRepository from "../../src/repositories/memberRepository";
import {
  createValidMember,
  createValidMemberWithId,
  setRegistrationStatus,
} from "../factories/memberFactory";
import MemberTooYoungError from "../../src/errors/MemberTooYoungError";
import MemberNotFoundError from "../../src/errors/MemberNotFoundError";
import MemberConflictError from "../../src/errors/MemberConflictError";
// import BaseError from "../../src/errors/BaseError";
import * as authService from "../../src/services/authService";
import * as activityRecordService from "../../src/services/activityRecordService";

const MINIMUM_REQUIRED_AGE = 15;

describe("member service", () => {
  describe("insert function", () => {
    describe("given the member data is valid", () => {
      it("should create a new member", async () => {
        const validMember = setRegistrationStatus(createValidMember(), "APPROVED", "test.test");

        jest.spyOn(memberRepository, "getMemberByCpf").mockResolvedValueOnce(null);
        jest.spyOn(memberRepository, "getMemberByRg").mockResolvedValueOnce(null);
        jest.spyOn(memberRepository, "getMemberByPassport").mockResolvedValueOnce(null);
        jest.spyOn(memberRepository, "getMemberBySecondaryEmail").mockResolvedValueOnce(null);
        jest.spyOn(memberRepository, "insertMember").mockImplementationOnce(() => {
          return [{ ...validMember, id: faker.datatype.number() }];
        });
        jest.spyOn(memberRepository, "getMemberByLattes").mockResolvedValueOnce(null);
        jest.spyOn(memberRepository, "getMemberByEmailLsd").mockResolvedValueOnce(null);

        jest.spyOn(authService, "getUsername").mockImplementation(() => {
          return "test.test";
        });

        jest.spyOn(authService, "getRole").mockImplementation(() => {
          return "SUPPORT";
        });

        //jest.spyOn(memberService, "createRegistrationStatus").mockImplementationOnce(() => {
        //  return [
        //    {
        //      role: "SUPPORT",
        //      status: "APPROVED",
        //      creator: "test.test",
        //      reviewdBy: "support.support",
        //    },
        //  ];
        //});

        jest.spyOn(activityRecordService, "createActivity").mockImplementationOnce(() => {
          return [
            {
              id: faker.datatype.number(),
              operation: "CREATE",
              entity: "MEMBER",
              newValue: validMember,
              idEntity: validMember.id,
              user: "test.test",
              date: new Date(),
            },
          ];
        });
        const result = memberService.createMember(validMember, "testeToken");

        expect(result).resolves.toMatchObject([validMember]);
      });
    });

    describe("given the member's cpf is already taken", () => {
      it("should not allow to create a duplicate", async () => {
        expect.assertions(2);
        const duplicateCpfMember = createValidMemberWithId({ cpf: "123456789098" });

        jest.spyOn(memberRepository, "getMemberByCpf").mockResolvedValueOnce(duplicateCpfMember);

        const result = memberService.createMember(duplicateCpfMember, "token");

        await expect(result).rejects.toThrow(MemberConflictError);
        expect(result).rejects.toEqual(new MemberConflictError("cpf", duplicateCpfMember.cpf));
      });
    });

    describe("given the member's rg is already taken", () => {
      it("should not allow to create a duplicate", async () => {
        expect.assertions(2);
        const duplicateRgMember = createValidMemberWithId({ rg: "123456789098" });

        jest.spyOn(memberRepository, "getMemberByRg").mockResolvedValueOnce(duplicateRgMember);

        const result = memberService.createMember(duplicateRgMember, "token");

        await expect(result).rejects.toThrow(MemberConflictError);
        expect(result).rejects.toEqual(new MemberConflictError("rg", duplicateRgMember.rg));
      });
    });

    describe("given the member's passport number is already taken", () => {
      it("should not allow to create a duplicate", async () => {
        expect.assertions(2);
        const duplicatePassportMember = createValidMemberWithId({ passport: "FG1542685" });

        jest
          .spyOn(memberRepository, "getMemberByPassport")
          .mockResolvedValueOnce(duplicatePassportMember);

        const result = memberService.createMember(duplicatePassportMember, "token");

        await expect(result).rejects.toThrow(MemberConflictError);
        expect(result).rejects.toEqual(
          new MemberConflictError("passport", duplicatePassportMember.passport)
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

        const result = memberService.createMember(duplicateEmailMember, "token");

        await expect(result).rejects.toThrow(MemberConflictError);
        expect(result).rejects.toEqual(
          new MemberConflictError("secondaryEmail", duplicateEmailMember.secondaryEmail)
        );
      });
    });

    describe(`given member is younger than ${MINIMUM_REQUIRED_AGE}`, () => {
      it("should not allow to create a new member, because he/she is too young", async () => {
        expect.assertions(2);
        const mockBirthDate = dayjs()
          .subtract(MINIMUM_REQUIRED_AGE, "years")
          .add(1, "days")
          .toISOString();

        const tooYoungMember = createValidMember({ birthDate: mockBirthDate });

        const result = memberService.createMember(tooYoungMember, "token");

        await expect(result).rejects.toThrow(MemberTooYoungError);
        expect(result).rejects.toEqual(new MemberTooYoungError());
      });
    });
  });

  describe("getMemberById function", () => {
    describe("given the member's id is valid", () => {
      it("should return the member's data", async () => {
        expect.assertions(3);
        const memberGeneratedId = faker.datatype.number();
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
        const memberInvalidId = faker.datatype.number();

        jest.spyOn(memberRepository, "getMemberById").mockResolvedValueOnce(null);
        const result = memberService.getMemberById(memberInvalidId);

        expect(memberRepository.getMemberById).toBeCalledWith(memberInvalidId);
        await expect(result).rejects.toThrow(MemberNotFoundError);
        expect(result).rejects.toEqual(new MemberNotFoundError("id", memberInvalidId));
      });
    });
  });
  describe("getAllMembers function", () => {
    describe("given getAllMembers is called", () => {
      it("should return all members created", async () => {
        expect.assertions(3);
        const memberGeneratedId = faker.datatype.number();
        const validMemberWithId = createValidMemberWithId({ id: memberGeneratedId });
        const memberGeneratedId2 = faker.datatype.number();
        const validMemberWithId2 = createValidMemberWithId({ id: memberGeneratedId2 });

        jest
          .spyOn(memberRepository, "getAllMembers")
          .mockImplementationOnce(() => [validMemberWithId, validMemberWithId2]);
        const result = await memberService.getAllMembers();

        expect(memberRepository.getAllMembers).toBeCalledTimes(1);
        expect(memberRepository.getAllMembers).toBeCalledWith({});
        expect(result).toEqual([validMemberWithId, validMemberWithId2]);
      });
    });
  });

  describe("updateMember function", () => {
    const existingMember = setRegistrationStatus(
      createValidMemberWithId(),
      "APPROVED",
      "test.test"
    );
    const newMember = setRegistrationStatus(createValidMemberWithId(), "APPROVED", "test.test");

    jest.spyOn(memberRepository, "getMemberById").mockResolvedValue(existingMember);
    jest.spyOn(memberRepository, "getMemberByCpf").mockResolvedValue(null);
    jest.spyOn(memberRepository, "getMemberByRg").mockResolvedValue(null);
    jest.spyOn(memberRepository, "getMemberByPassport").mockResolvedValue(null);
    jest.spyOn(memberRepository, "getMemberBySecondaryEmail").mockResolvedValue(null);

    describe("given the member is not present", () => {
      it("should not allow the update to proceed", async () => {
        // expect.assertions(2);
        jest.spyOn(memberRepository, "getMemberById").mockResolvedValueOnce(null);

        const result = memberService.updateMember(newMember, "token");

        expect(memberRepository.getMemberById).toBeCalledWith(newMember.id);
        await expect(result).rejects.toThrow(MemberNotFoundError);
        expect(result).rejects.toEqual(new MemberNotFoundError("Id", newMember.id));
      });
    });
    describe("given member's data is duplicated", () => {
      it("should not update member's cpf", async () => {
        expect.assertions(2);
        jest.spyOn(memberRepository, "getMemberByCpf").mockResolvedValueOnce(existingMember);

        const result = memberService.updateMember(newMember);

        await expect(result).rejects.toThrow(MemberConflictError);
        expect(result).rejects.toEqual(new MemberConflictError("cpf", newMember.cpf));
      });

      it("should not update member's rg", async () => {
        expect.assertions(2);
        jest.spyOn(memberRepository, "getMemberByRg").mockResolvedValueOnce(existingMember);

        const result = memberService.updateMember(newMember, "token");

        await expect(result).rejects.toThrow(MemberConflictError);
        expect(result).rejects.toEqual(new MemberConflictError("rg", newMember.rg));
      });

      it("should not update member's passport", async () => {
        expect.assertions(2);
        jest.spyOn(memberRepository, "getMemberByPassport").mockResolvedValueOnce(existingMember);

        const result = memberService.updateMember(newMember, "token");

        await expect(result).rejects.toThrow(MemberConflictError);
        expect(result).rejects.toEqual(new MemberConflictError("passport", newMember.passport));
      });

      it("should not update member's secondary email", async () => {
        expect.assertions(2);
        jest
          .spyOn(memberRepository, "getMemberBySecondaryEmail")
          .mockResolvedValueOnce(existingMember);

        const result = memberService.updateMember(newMember, "token");

        await expect(result).rejects.toThrow(MemberConflictError);
        expect(result).rejects.toEqual(
          new MemberConflictError("secondaryEmail", newMember.secondaryEmail)
        );
      });
    });

    describe("given member is too young", () => {
      it("should not allow to update member's age", async () => {
        expect.assertions(2);
        const { id } = existingMember;

        const mockBirthDate = dayjs()
          .subtract(MINIMUM_REQUIRED_AGE, "years")
          .add(1, "days")
          .toISOString();

        const tooYoungMember = createValidMemberWithId({
          id,
          birthDate: mockBirthDate,
        });

        const result = memberService.updateMember(tooYoungMember, "token");

        await expect(result).rejects.toThrow(MemberTooYoungError);
        expect(result).rejects.toEqual(new MemberTooYoungError());
      });
    });

    describe("given member data is valid", () => {
      it("should call update function", async () => {
        expect.assertions(3);
        const { birthDate } = newMember;

        jest
          .spyOn(memberRepository, "updateMember")
          .mockResolvedValueOnce({ ...newMember, birthDate });

        jest.spyOn(authService, "getUsername").mockImplementation(() => {
          return "test.test";
        });
        jest.spyOn(activityRecordService, "createActivity").mockImplementationOnce(() => {
          return [
            {
              id: faker.datatype.number(),
              operation: "UPDATE",
              entity: "MEMBER",
              newValue: newMember,
              idEntity: newMember.id,
              user: "test.test",
              date: new Date(),
            },
          ];
        });
        const result = memberService.updateMember({ ...newMember, birthDate }, "validToken");

        await expect(result).resolves.toEqual({ ...newMember, birthDate });
        expect(memberRepository.updateMember).toBeCalledTimes(1);
        expect(memberRepository.updateMember).toBeCalledWith({
          ...newMember,
          birthDate,
        });
      });
    });
  });
});
