import httpStatusCode from "../enum/httpStatusCode";
import { loginSchema } from "../schemas/authSchema";
import BaseError from "../errors/BaseError";
import { authenticateUser } from "../services/authService";

export async function login(req, res, next) {
  const { body } = req;

  const joiValidation = loginSchema.validate(body);
  if (joiValidation.error) {
    const errorMessage = joiValidation.error.details.map((err) => err.message);
    return res.status(httpStatusCode.BAD_REQUEST).send(errorMessage);
  }

  const { username, password } = body;
  try {
    const result = await authenticateUser({ username, password });

    if (result.err) {
      return res.status(result.status).json({
        error: true,
        message: result.err,
      });
    } else {
      return res.status(200).json({
        token: result.jwToken,
      });
    }
  } catch (err) {
    if (err instanceof BaseError) {
      return res.status(err.statusCode).send(err.message);
    }
    next(err);
  }
}
