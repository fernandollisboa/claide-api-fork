import joiBase from "joi";
import extension from "@joi/date";

const joi = joiBase.extend(extension);

const createProjectSchema = joi.object({
  name: joi.string().required(),
  creationDate: joi.date().iso().required(),
  endDate: joi.date().iso().allow(""),
  room: joi.string().allow(""),
  building: joi.string().allow(""),
  embrapiiCode: joi.string().allow(""),
  financier: joi.string().allow(""),
});

export default createProjectSchema;
