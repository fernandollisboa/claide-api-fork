/* eslint-disable no-unused-vars */
import httpStatusCode from "../enum/httpStatusCode";
import BaseError from "../errors/BaseError";

export default async function (err, req, res, next) {
  if (err instanceof BaseError) {
    return res.status(err.statusCode).send(err.message);
  }
  console.error("Middleware de erro: ", err);
  return res.sendStatus(httpStatusCode.INTERNAL_SERVER_ERROR);
}
