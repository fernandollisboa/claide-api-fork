import { loginSchema } from "../schemas/authSchema";
import { authenticateUser } from "../services/authService";

export async function login(req, res) {
  const joiValidation = loginSchema.validate(req.body);
  if (joiValidation.error)
    return res.status(403).json({
      msg: "Invalid format",
    });

  const { username, password } = req.body;
  try {
    const result = await authenticateUser({ username, password });
    if (result.err) {
      return res.status(result.status).json({
        error: true,
        message: result.err,
      });
    } else {
      return res.status(200).json({
        username: result.username,
        jwToken: result.jwToken,
      });
    }
  } catch (err) {
    return res.status(401).json({
      error: err,
    });
  }
}
