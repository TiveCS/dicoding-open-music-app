const Joi = require('joi');

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number().min(1).integer().optional(),
  albumId: Joi.string().optional(),
});

module.exports = SongPayloadSchema;
