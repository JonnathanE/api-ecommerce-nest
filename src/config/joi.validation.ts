import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  PORT: Joi.number().default(3000),
  HOST_API: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});
