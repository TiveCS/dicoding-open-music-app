const routes = require('./routes');
const PlaylistsHandler = require('./handler');

module.exports = {
  name: 'playlistPlugin',
  version: '1.0.0',
  register: async (
    server,
    {
      playlistsService,
      songsService,
      playlistSongActivitiesService, //
      playlistValidator,
      activitiesValidator,
    }
  ) => {
    const playlistsHandler = new PlaylistsHandler(
      playlistsService,
      songsService,
      playlistSongActivitiesService, //
      playlistValidator,
      activitiesValidator
    );
    server.route(routes(playlistsHandler));
  },
};
