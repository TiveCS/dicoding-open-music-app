const routes = require('./routes');
const UploadsHandler = require('./handler');

const uploadsPlugin = {
  name: 'uploadsPlugin',
  version: '1.0.0',
  register: async (server, { storageService, albumsService, validator }) => {
    const uploadsHandler = new UploadsHandler(
      storageService,
      albumsService,
      validator
    );
    server.route(routes(uploadsHandler));
  },
};

module.exports = uploadsPlugin;
