import Joi from 'joi';

export const validateAddAgency = Joi.object({
  tag: Joi.string().required(),
  name: Joi.string().required()
});

export const validateUpdateAgency = Joi.object({
  agency_id: Joi.number().integer().required(),
  tag: Joi.string().required(),
  name: Joi.string().required()
});

export const validateViewAgency = Joi.object({
  id: Joi.number().integer().required()
});

export const validateAllocateResource = Joi.object({
  agency_id: Joi.number().integer().required()
});
