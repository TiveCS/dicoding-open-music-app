const routes = require('./routes');
const SongsHandler = require('./handler');

const songsPlugin = {
  name: 'songsPlugin',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const songsHandler = new SongsHandler(service, validator);

    server.route(routes(songsHandler));
  },
};

module.exports = songsPlugin;
