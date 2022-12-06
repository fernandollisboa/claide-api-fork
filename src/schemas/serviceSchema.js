import joiBase from "joi";
import extension from "@joi/date";

const joi = joiBase.extend(extension);

export const createServiceSchema = joi.object({
  name: joi.string().required().messages({
    "string.base": "Name should be a string",
    "any.required": "Member should have a name",
  }),
});
