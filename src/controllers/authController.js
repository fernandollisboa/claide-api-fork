import UserUnauthorizedOrNotFoundError from "../errors/UserUnauthorizedOrNotFoundError";
import mockAuthenticateUser from "../mockLdap/mockAuthenticateUser";

export async function login(req, res, next) {
  const { username, password } = req.body;
  try {
    const { err, jwToken } = await mockAuthenticateUser({ username, password });

    if (err) {
      throw new UserUnauthorizedOrNotFoundError(username, err);
    }

    return res.status(200).send({
      token: jwToken,
    });
  } catch (err) {
    next(err);
  }
}
