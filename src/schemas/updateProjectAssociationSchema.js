import joiBase from "joi";
import extension from "@joi/date";

const joi = joiBase.extend(extension);

const updateProjectAssociationSchema = joi.object({
  startDate: joi.date().iso(),
  endDate: joi.date().iso().allow(""),
});

export default updateProjectAssociationSchema;
