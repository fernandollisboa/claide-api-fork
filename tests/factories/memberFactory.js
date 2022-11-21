import { faker } from "@faker-js/faker";
import { MemberType } from "@prisma/client";
import dayjs from "dayjs";

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
  isActive,
  isBrazilian,
} = {}) {
  const sex = faker.name.sex();
  const fullName = faker.name.fullName(sex);
  const [firstName, lastName] = fullName.split(" ");

  return {
    name: name || faker.name.fullName(),
    email: email || faker.internet.email(),
    birthDate:
      birthDate ||
      dayjs(faker.date.birthdate({ min: 18, max: 65, mode: "age" })).format("DD/MM/YYYY"),
    username: username || faker.name.firstName(),
    cpf: cpf || faker.helpers.regexpStyleStringParse("/^d{11}$/"),
    rg: rg || faker.helpers.regexpStyleStringParse("/^d{7,11}$/"),
    passport: passport || faker.helpers.regexpStyleStringParse("[A-Z]{2}[0-9]{7}"),
    phone: phone || faker.helpers.regexpStyleStringParse("/^[/0-9]{11,13}$/"),
    lsdEmail: lsdEmail || faker.helpers.regexpStyleStringParse("/^w+([.-]?w+)*@(lsd.ufcg.edu.br)/"),
    secondaryEmail: secondaryEmail || faker.internet.email(firstName, lastName),
    memberType: memberType || faker.helpers.arrayElement(Object.keys(MemberType)),
    lattes: lattes || "https://lattes.cnpq.br/",
    roomName: roomName || faker.animal.lion(),
    hasKey: hasKey || false,
    isActive: isActive || false,
    isBrazilian: isBrazilian || true,
  };
}
export function createValidMemberWithId({ id, ...props }) {
  return { id, ...createValidMember({ ...props }) };
}

