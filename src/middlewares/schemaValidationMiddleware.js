import httpStatusCode from "../enum/httpStatusCode";

export default function validateSchema(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const { details } = error;
      const [errorMessages, errorLabels] = details.map(({ message, context }) => [
        message,
        context.label,
      ]);
      return res
        .status(httpStatusCode.UNPROCESSABLE_ENTITY)
        .send({ message: errorMessages, errorLabels });
    }

    return next();
  };
}
