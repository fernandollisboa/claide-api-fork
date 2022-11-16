import { faker } from "@faker-js/faker";

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
  return {
    name: name || faker.name.fullName(),
    email: email || faker.internet.email(),
    birthDate: birthDate || "12/05/1999", // faker.date.birthdate({ min: 18, mode: "age" }),
    username: username || faker.name.firstName(),
    cpf: cpf || "02152654785", // faker.helpers.regexpStyleStringParse('/^\d{11}$/') ,
    rg: rg || "1241569585", //faker.helpers.regexpStyleStringParse('/^\d{7,11}$/'),
    passport: passport || "FV4584758", //aker.helpers.regexpStyleStringParse('[A-Z]{2}[0-9]{7}'),
    phone: phone || "79993237417", //faker.helpers.regexpStyleStringParse('/^[/0-9]{11,13}$/') ,
    lsdEmail: lsdEmail || "fernando@lsd.com",
    secondaryEmail: secondaryEmail || "fernando@hotmail.com",
    memberType: memberType || "STUDENT",
    lattes: lattes || "link pro lattes",
    roomName: roomName || "sala 2",
    hasKey: hasKey || false,
    isActive: isActive || false,
    isBrazilian: isBrazilian || true,
  };
}
