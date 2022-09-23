const Joi = require('joi');

const PlaylistSongActivitiesSchema = Joi.object({
  playlistId: Joi.string().required(),
  songId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = { PlaylistSongActivitiesSchema };
