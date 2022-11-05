import jwt from "jsonwebtoken";

// eslint-disable-next-line consistent-return
export default async function auth(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.split("Bearer ")[1];

  if (!token) return res.sendStatus(400);

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.sendStatus(401);
  }

  next();
}
