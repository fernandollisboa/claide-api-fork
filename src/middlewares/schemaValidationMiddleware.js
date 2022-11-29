// import schemas from "../schemas";
// import ValidationError from "../errors/ValidationError";
import httpStatusCode from "../enum/httpStatusCode";

export default function validateSchema(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(httpStatusCode.UNPROCESSABLE_ENTITY).send(errorMessages);
    }

    return next();
  };
}
