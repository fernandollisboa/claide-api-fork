import { faker } from "@faker-js/faker";
import { MemberType } from "@prisma/client";
import dayjs from "dayjs";
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
} = {}) {
  const sex = faker.name.sex();
  const fullName = faker.name.fullName(sex);
  const [firstName, lastName] = fullName.split(" ");

  return {
    name: name ?? fullName,
    email: email ?? faker.internet.email(), // TO-DO remover isso
    birthDate: birthDate ?? dayjs(faker.date.birthdate({ min: 18, max: 65, mode: "age" })).format("DD/MM/YYYY"),
    username: username ?? `${firstName}.${lastName}`.toLowerCase(),
    cpf: cpf ?? new RandExp(/[0-9]{11}/).gen(),
    rg: rg ?? new RandExp(/[0-9]{7,11}/).gen(),
    passport: passport ?? new RandExp(/[A-Z]{2}[0-9]{7}/).gen(),
    phone: phone ?? new RandExp(/[0-9]{11,13}/).gen(),
    lsdEmail: lsdEmail ?? faker.internet.email(firstName, lastName, "lsd.ufcg.edu.br").toLowerCase(),
    secondaryEmail: secondaryEmail ?? faker.internet.email(firstName, lastName).toLowerCase(),
    memberType: memberType ?? faker.helpers.arrayElement(Object.keys(MemberType)),
    lattes: lattes ?? `https://lattes.cnpq.br/${firstName}${lastName}`.toLowerCase(),
    roomName: roomName ?? faker.animal.lion(),
    hasKey: hasKey ?? false,
    isBrazilian: isBrazilian ?? true,
  };
}
export function createValidMemberWithId({ id, ...props } = {}) {
  return { id: id ?? faker.datatype.number(), ...createValidMember({ ...props }) };
}
