import prisma from "../database/prismaClient";

async function insertPerson({ name, email, password }) {
  const person = await prisma.person.create({
    data: {
      name,
      email,
      password,
    },
  });
  return person;
}

async function getPerson() {}
export { insertPerson, getPerson };
