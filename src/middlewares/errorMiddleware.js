/* eslint-disable no-unused-vars */
import httpStatusCode from "../enum/httpStatusCode";
import BaseError from "../errors/BaseError";
import { Prisma } from "@prisma/client";
import ConflictError from "../errors/ConflictError";
import ProjectInvalidCreationOrEndDateError from "../errors/ProjectInvalidCreationOrEndDateError";

export default async function errorMiddleware(err, req, res, next) {
  console.error("Middleware de erro:\n", err);

  if (err instanceof ConflictError || err instanceof ProjectInvalidCreationOrEndDateError)
    return res.status(err.statusCode).send({ message: err.message, errorLabels: err.errorLabels });

  if (err instanceof BaseError) return res.status(err.statusCode).send({ message: err.message });

  if (err instanceof Prisma.PrismaClientValidationError)
    return res.status(httpStatusCode.BAD_REQUEST).send({ message: err.message });

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const { target } = err.meta;
      return res
        .status(httpStatusCode.CONFLICT)
        .send({ message: `duplicate data on column "${target}"`, errorLabels: target }); //TODO evitar que create member utilize disso
    }
  }

  return res.sendStatus(httpStatusCode.INTERNAL_SERVER_ERROR);
}
