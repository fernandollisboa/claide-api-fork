import prisma from "../database/prismaClient";

async function insertPerson({
  name,
  email,
  birthDate,
  cpf,
  rg,
  passport,
  phone,
  lsdEmail,
  secondEmail,
  personType,
  lattes,
  room,
  has_key,
}) {
  const person = await prisma.person.create({
    data: {
      name,
      email,
      birthDate,
      cpf,
      rg,
      passport,
      phone,
      lsdEmail,
      secondEmail,
      personType,
      lattes,
      room,
      has_key,
    },
  });
  return person;
}

async function getPerson(id) {
  const person = await prisma.person.findOne({ where: { id: id } });

  return person;
}
export { insertPerson, getPerson };
