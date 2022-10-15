const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required().max(255),
  year: Joi.number().integer().required(),
});

module.exports = { AlbumPayloadSchema };
