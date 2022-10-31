import { signupSchema } from "../schemas/signupSchema";
import * as personService from "../services/personService";

export async function createPerson(req, res) {
  const { body } = req;
  const joiValidation = signupSchema.validate(body);

  if (joiValidation.error) {
    return res.status(400).send(joiValidation.error.details);
  }

  const createdPerson = await personService.createPerson(body);

  return res.status(201).send(createdPerson);
}
