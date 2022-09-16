const routes = (handler) => {
  return [
    {
      method: 'POST',
      path: '/albums',
      handler: handler.postAlbumHandler,
    },
  ];
};

module.exports = routes;
