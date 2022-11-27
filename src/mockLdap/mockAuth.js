/* eslint-disable no-unused-vars */
import jwt from "jsonwebtoken";
import httpStatusCode from "../enum/httpStatusCode";

export default async function mockAuth(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.split("Bearer ")[1];

  if (!token)
    return res
      .status(httpStatusCode.UNAUTHORIZED)
      .json({ message: "Missing authorization Bearer token in header" });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(httpStatusCode.UNAUTHORIZED).json({ message: "User Unauthorized" });
  }
  next();
}
