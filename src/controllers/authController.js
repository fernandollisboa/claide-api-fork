import { loginSchema } from "../schemas/authSchema";
import { authenticateUser } from "../services/authService";

export async function login(req, res) {
  const joiValidation = loginSchema.validate(req.body);
  if (joiValidation.error)
    return res.status(403).json({
      msg: "formato invalido",
    });

  const { userName, password } = req.body;
  try {
    const result = await authenticateUser({ userName, password });
    if (result.err) {
      return res.status(result.status).json({
        error: true,
        message: result.err,
      });
    } else {
      return res.status(200).json({
        userName: result.userName,
        jwToken: result.jwToken,
      });
    }
  } catch (err) {
    return res.status(403).json({
      error: err,
    });
  }
}
