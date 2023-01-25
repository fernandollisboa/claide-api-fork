import joiBase from "joi";
import extension from "@joi/date";

const joi = joiBase.extend(extension);

const createProjectAssociationSchema = joi.object({
  startDate: joi.date().iso().required(),
  endDate: joi.date().iso().allow(""),
});

export default createProjectAssociationSchema;
