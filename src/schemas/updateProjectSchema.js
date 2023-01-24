import joiBase from 'joi';
import extension from '@joi/date';

const joi = joiBase.extend(extension);

const updateProjectSchema = joi.object({
  id: joi.number().integer().required(),
  name: joi.string(),
  creationDate: joi.date().format('DD/MM/YYYY'),
  endDate: joi.date().allow(null).format('DD/MM/YYYY'),
  room: joi.string().allow(null),
  building: joi.string().allow(null),
  embrapiiCode: joi.string().allow(null),
  financier: joi.string().allow(null),
});

export default updateProjectSchema;
