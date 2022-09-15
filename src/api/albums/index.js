const AlbumHandler = require('./handler');
const routes = require('./routes');

const albumsPlugin = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const handler = new AlbumHandler();

    server.route(routes(handler));
  },
};

module.exports = albumsPlugin;
