import UserUnauthorizedOrNotFoundError from "../errors/UserUnauthorizedOrNotFoundError";
import { authenticateUser } from "../services/authService";

export async function login(req, res, next) {
  const { username, password } = req.body;
  try {
    const { err, jwToken } = await authenticateUser({ username, password });

    if (err) {
      throw new UserUnauthorizedOrNotFoundError(username, err);
    }
    return res.status(200).send({
      token: jwToken,
    });
  } catch (err) {
    //TO-DO gambiarra pra funcionar do jeito que está atualmente, gostaria de mudar para errors isntanciados quando conseguirmos testar o ldap mermo @fernandollisboa
    if (err.err) {
      return res.status(err.status).send(err.err);
    }
    next(err);
  }
}
