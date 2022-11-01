import * as personRepository from "../repositories/personRepository";

async function createPerson({
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
  return personRepository.insertPerson({
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
  });
}

async function getPerson(id) {
  return personRepository.getPerson(id);
}
export { createPerson, getPerson };
