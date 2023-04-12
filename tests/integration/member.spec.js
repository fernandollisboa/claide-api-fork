import { dmmf } from "@prisma/client";
import supertest from "supertest";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";

import app from "../../src/app";
import prisma from "../../src/database/prismaClient";

import "../../src/setup";
import { describe, it, expect, afterAll, beforeAll } from "@jest/globals";
import httpStatusCode from "../../src/enum/httpStatusCode";
import { createTestMemberBody } from "../helpers/createTestMemberBody";
import mockAuthenticateUser from "../../src/mockLdap/mockAuthenticateUser";

const { OK, CREATED, CONFLICT, UNPROCESSABLE_ENTITY, BAD_REQUEST, NOT_FOUND } = httpStatusCode;

const agent = supertest.agent(app);

// TODO testar filtros
function createAuthenticatedRequest() {
  const { jwToken } = mockAuthenticateUser({ username: "test", password: "test" });

  return function () {
    return agent.set("Authorization", `Bearer ${jwToken}`);
  };
}

afterAll(async () => {
  const modelKeys = dmmf.datamodel.models.map((model) => model.name);

  return Promise.all(
    modelKeys.map((table) => {
      prisma.$executeRaw`DELETE FROM ${table};`;
    })
  );
});

describe("POST /members route", () => {
  const authenticatedAgent = createAuthenticatedRequest();
  function authenticatedAgentPostMembers() {
    return authenticatedAgent().post("/members");
  }

  it("should return 201 when passing valid information", async () => {
    const memberBody = createTestMemberBody();
    const { status } = await authenticatedAgentPostMembers().send(memberBody);
    expect(status).toEqual(CREATED);
  });

  it("should return 201 when NOT passing LSD email", async () => {
    const memberBody = createTestMemberBody({ lsdEmail: "" });
    const { status } = await authenticatedAgent().post("/members").send(memberBody);
    expect(status).toEqual(CREATED);
  });

  it("should return 422 when passing invalid body - name", async () => {
    const memberBody = createTestMemberBody({ name: "" });
    const { status } = await authenticatedAgent().post("/members").send(memberBody);
    expect(status).toEqual(UNPROCESSABLE_ENTITY);
  });

  it("should return 422 when passing invalid body - cpf", async () => {
    const memberBody = createTestMemberBody({ cpf: "1526532685", isBrazilian: true });
    const { status } = await authenticatedAgent().post("/members").send(memberBody);
    expect(status).toEqual(UNPROCESSABLE_ENTITY);
  });

  it("should return 422 when passing invalid body - email", async () => {
    const memberBody = createTestMemberBody({ email: "" });
    const { status } = await authenticatedAgent().post("/members").send(memberBody);
    expect(status).toEqual(UNPROCESSABLE_ENTITY);
  });

  it("should NOT return 422 when passing valid body - services", async () => {
    const memberBody = createTestMemberBody({ services: "invalidstring" });
    const { status } = await authenticatedAgent().post("/members").send(memberBody);
    expect(status).toEqual(UNPROCESSABLE_ENTITY);
  });

  it("should return 400 when passing invalid body - birthDate", async () => {
    const memberBody = createTestMemberBody({
      birthDate: new Date(dayjs(faker.date.future(1, "2030-01-01T00:00:00.000Z"))),
    });
    const { status } = await authenticatedAgent().post("/members").send(memberBody);
    expect(status).toEqual(BAD_REQUEST);
  });

  it("given a member with duplicate name it should return 409", async () => {
    const memberBody = createTestMemberBody({ name: "duplicate" });

    const firstTry = await authenticatedAgentPostMembers().send(memberBody);
    expect(firstTry.status).toEqual(CREATED);

    const secondTry = await authenticatedAgentPostMembers().send(memberBody);
    expect(secondTry.status).toEqual(CONFLICT);
  });
});

describe("PUT /members route", () => {
  const authenticatedAgent = createAuthenticatedRequest();
  const memberBody = createTestMemberBody();
  var _memberId;
  beforeAll(async () => {
    const {
      body: { id: memberId },
    } = await authenticatedAgent().post("/members").send(memberBody);
    _memberId = memberId;
  });

  it("should return 200 when passing valid information", async () => {
    const response = await authenticatedAgent().put(`/members/${_memberId}`).send(memberBody);
    expect(response.status).toEqual(OK);

    const { body } = await authenticatedAgent().get(`/members/${_memberId}`);
    expect(body).toMatchObject(memberBody);
  });

  it("should return 404 when passing nonexistent userId", async () => {
    const { status } = await authenticatedAgent().put(`/members/-1`).send(memberBody);
    expect(status).toEqual(NOT_FOUND);
  });

  it("should return 422 when passing invalid body - name", async () => {
    const memberBody = createTestMemberBody({ name: "" });
    const { status } = await authenticatedAgent().put(`/members/${_memberId}`).send(memberBody);
    expect(status).toEqual(UNPROCESSABLE_ENTITY);
  });

  it("should return 422 when passing invalid body - cpf", async () => {
    const memberBody = createTestMemberBody({ cpf: "1526532685", isBrazilian: true });
    const { status } = await authenticatedAgent().put(`/members/${_memberId}`).send(memberBody);
    expect(status).toEqual(UNPROCESSABLE_ENTITY);
  });

  it("should return 422 when passing invalid body - email", async () => {
    const memberBody = createTestMemberBody({ email: "" });
    const { status } = await authenticatedAgent().put(`/members/${_memberId}`).send(memberBody);
    expect(status).toEqual(UNPROCESSABLE_ENTITY);
  });

  it("should return 422 when passing valid body - services", async () => {
    const memberBody = createTestMemberBody({ services: "invalidstring" });
    const { status } = await authenticatedAgent().put(`/members/${_memberId}`).send(memberBody);
    expect(status).toEqual(UNPROCESSABLE_ENTITY);
  });

  it("should return 400 when passing invalid body - birthDate", async () => {
    const memberBody = createTestMemberBody({
      birthDate: new Date(dayjs(faker.date.future(1, "2030-01-01T00:00:00.000Z"))),
    });
    const { status } = await authenticatedAgent().put(`/members/${_memberId}`).send(memberBody);
    expect(status).toEqual(BAD_REQUEST);
  });

  it("given a member with duplicate name it should return 409", async () => {
    const newMemberBody = createTestMemberBody();

    const firstTry = await authenticatedAgent().post("/members").send(newMemberBody);
    expect(firstTry.status).toEqual(CREATED);
    const { status } = await authenticatedAgent()
      .put(`/members/${firstTry.body.id}`)
      .send(memberBody);

    expect(status).toEqual(CONFLICT);
  });
});

describe("Get Members route", () => {
  const authenticatedAgent = createAuthenticatedRequest();
  async function authenticatedAgentGetMembers() {
    return authenticatedAgent().get("/members");
  }
  it("should return 200", async () => {
    const { status } = await authenticatedAgentGetMembers();

    expect(status).toBe(OK);
  });
});

describe("Get Member route", () => {
  const authenticatedAgent = createAuthenticatedRequest();
  const memberBody = createTestMemberBody();
  var _memberId;

  beforeAll(async () => {
    const {
      body: { id: memberId },
    } = await authenticatedAgent().post("/members").send(memberBody);
    _memberId = memberId;
  });

  it("should return 200 with user data when passing existing userId", async () => {
    const { status, body } = await authenticatedAgent().get(`/members/${_memberId}`);

    expect(status).toBe(OK);
    expect(body).toMatchObject(memberBody);
  });

  it("should return 404 with user data when passing nonexistent userId", async () => {
    const { status } = await authenticatedAgent().get(`/members/-1`);

    expect(status).toBe(NOT_FOUND);
  });
});
