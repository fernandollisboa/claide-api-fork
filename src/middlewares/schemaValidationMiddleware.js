import httpStatusCode from "../enum/httpStatusCode";

export default function validateSchema(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      console.log(error.details);
      const errorMessages = error.details.map((detail) => detail.message);
      const errorLabels = error.details.map((detail) => detail.context.label);
      return res
        .status(httpStatusCode.UNPROCESSABLE_ENTITY)
        .send({ message: errorMessages, errorLabels: errorLabels });
    }

    return next();
  };
}
