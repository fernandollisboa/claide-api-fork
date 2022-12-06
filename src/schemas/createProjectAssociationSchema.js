import joiBase from "joi";
import extension from "@joi/date";

const joi = joiBase.extend(extension);

const createProjectAssociationSchema = joi.object({
  projectId: joi.number().integer().required(),
  memberId: joi.number().integer().required(),
  startDate: joi.date().format("DD/MM/YYYY").required(),
  endDate: joi.date().allow(null).format("DD/MM/YYYY"),
});

export default createProjectAssociationSchema;
