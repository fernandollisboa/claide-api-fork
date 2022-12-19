import jwt from "jsonwebtoken";
import httpStatusCode from "../enum/httpStatusCode";

// eslint-disable-next-line consistent-return
export default async function auth(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.split("Bearer ")[1];

  if (!token)
    return res
      .status(httpStatusCode.BAD_REQUEST)
      .send({ message: "Missing authorization Bearer token in headers" });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(httpStatusCode.UNAUTHORIZED).send({ message: "User Unauthorized" });
  }

  next();
}
