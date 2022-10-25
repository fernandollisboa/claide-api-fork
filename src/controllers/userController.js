import { signupSchema } from "../schemas/signupSchema";
import * as userService from "../services/userService";

export async function createUser(req, res) {
  const { body } = req;
  const joiValidation = signupSchema.validate(body);

  if (joiValidation.error) {
    return res.status(400).send(joiValidation.error.details);
  }

  const createdUser = await userService.createUser(body);

  return res.status(201).send(createdUser);
}
