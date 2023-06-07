import joiBase from "joi";
import extension from "@joi/date";

const joi = joiBase.extend(extension);

const updateProjectSchema = joi.object({
  name: joi.string(),
  creationDate: joi.date().iso(),
  endDate: joi.date().iso().allow(""),
  room: joi.string().allow(""),
  building: joi.string().allow(""),
  embrapiiCode: joi.string().allow(""),
  financier: joi.string().allow(""),
});

export default updateProjectSchema;
