import { signupSchema } from "../schemas/signupSchema";
import * as personService from "../services/personService";

async function createPerson(req, res) {
  const { body } = req;
  const joiValidation = signupSchema.validate(body);

  if (joiValidation.error) {
    return res.status(400).send(joiValidation.error.details);
  }

  const createdPerson = await personService.createPerson(body);

  return res.status(201).send(createdPerson);
}
async function getPerson(req, res) {
  const { id } = req.id;

  const person = await personService.getPerson(id);

  return res.status(200).send(person);
}
export { createPerson, getPerson };
