/* eslint-disable no-unused-vars */
import httpStatusCode from "../enum/httpStatusCode";

export default async function (err, req, res, next) {
  console.error("Middleware de erro: ", err);
  return res.sendStatus(httpStatusCode.INTERNAL_SERVER_ERROR);
}
