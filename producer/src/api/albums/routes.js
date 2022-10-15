const routes = (handler) => {
  return [
    {
      method: 'POST',
      path: '/albums',
      handler: (request, h) => handler.postAlbumHandler(request, h),
    },
    {
      method: 'GET',
      path: '/albums/{id}',
      handler: (request, h) => handler.getAlbumByIdHandler(request, h),
    },
    {
      method: 'PUT',
      path: '/albums/{id}',
      handler: (request, h) => handler.putAlbumByIdHandler(request, h),
    },
    {
      method: 'DELETE',
      path: '/albums/{id}',
      handler: (request, h) => handler.deleteAlbumByIdHandler(request, h),
    },
    {
      method: 'POST',
      path: '/albums/{id}/likes',
      handler: (request, h) => handler.postAlbumLikeHandler(request, h),
      options: {
        auth: 'openmusic_jwt',
      },
    },
    {
      method: 'GET',
      path: '/albums/{id}/likes',
      handler: (request, h) => handler.getAlbumLikesHandler(request, h),
    },
  ];
};

module.exports = routes;
