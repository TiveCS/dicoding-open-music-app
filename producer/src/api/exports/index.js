const routes = require('./routes');
const ExportHandler = require('./handler');

const exportPlugin = {
  name: 'exportPlugin',
  version: '1.0.0',
  register: async (
    server,
    { producerService, playlistsService, validator }
  ) => {
    const exportHandler = new ExportHandler(
      producerService,
      playlistsService,
      validator
    );

    server.route(routes(exportHandler));
  },
};

module.exports = exportPlugin;
