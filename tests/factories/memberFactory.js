import { faker } from "@faker-js/faker";
import { MemberType } from "@prisma/client";
import RandExp from "randexp";

export function createValidMember({
  name,
  email,
  birthDate,
  username,
  cpf,
  rg,
  passport,
  phone,
  lsdEmail,
  secondaryEmail,
  memberType,
  lattes,
  roomName,
  hasKey,
  isBrazilian,
  registrationStatus,
} = {}) {
  const sex = faker.name.sex();
  const fullName = faker.name.fullName(sex);
  const [firstName, lastName] = fullName.split(" ");

  return {
    name: name ?? fullName,
    email: email ?? faker.internet.email(),
    birthDate: birthDate ?? faker.date.birthdate({ max: 75, mode: "age" }),
    username: username ?? `${firstName}.${lastName}`.toLowerCase(),
    cpf: cpf ?? new RandExp(/[0-9]{11}/).gen(),
    rg: rg ?? new RandExp(/[0-9]{7,11}/).gen(),
    passport: passport ?? new RandExp(/[A-Z]{2}[0-9]{7}/).gen(),
    phone: phone ?? new RandExp(/[0-9]{11,13}/).gen(),
    lsdEmail:
      lsdEmail ?? faker.internet.email(firstName, lastName, "lsd.ufcg.edu.br").toLowerCase(),
    secondaryEmail: secondaryEmail ?? faker.internet.email(firstName, lastName).toLowerCase(),
    memberType: memberType ?? faker.helpers.arrayElement(Object.keys(MemberType)),
    lattes: lattes ?? `https://lattes.cnpq.br/${firstName}${lastName}`.toLowerCase(),
    roomName: roomName ?? faker.animal.lion(),
    hasKey: hasKey ?? false,
    isBrazilian: isBrazilian ?? true,
    registrationStatus: registrationStatus ?? {
      status: "PENDING",
      createdBy: faker.name.sex(),
      comment: "",
      reviewedBy: null,
    },
  };
}

export function createValidMemberWithId({ id, ...props } = {}) {
  return { id: id ?? faker.datatype.number(), ...createValidMember({ ...props }) };
}

export function setRegistrationStatus(member, newStatus, creator) {
  return {
    ...member,
    registrationStatus: { ...member.registrationStatus, status: newStatus, createdBy: creator },
  };
}
