import joiBase from "joi";
import extension from "@joi/date";

const joi = joiBase.extend(extension);

const updateProjectAssociationSchema = joi.object({
  startDate: joi.date().format("DD/MM/YYYY"),
  endDate: joi.date().allow(null).format("DD/MM/YYYY"),
});

export default updateProjectAssociationSchema;
