class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;

    const result = await this._service.getAlbumById(id);

    const response = h.response({
      status: 'success',
      data: {
        album: result,
      },
    });
    response.code(200);
    return response;
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const { id } = request.params;

    await this._service.editAlbumById(id, request.payload);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;

    await this._service.deleteAlbumById(id);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  async postAlbumLikeHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyAlbumById(id);

    const likeStatus = await this._service.getUserAlbumLike(id, credentialId);

    if (!likeStatus) {
      await this._service.addAlbumLike(id, credentialId);

      const response = h.response({
        status: 'success',
        message: 'Album berhasil di like',
      });
      response.code(201);

      return response;
    } else {
      await this._service.deleteAlbumLike(id, credentialId);

      const response = h.response({
        status: 'success',
        message: 'Membatalkan like pada album',
      });
      response.code(201);

      return response;
    }
  }

  async getAlbumLikesHandler(request, h) {
    const { id } = request.params;

    await this._service.verifyAlbumById(id);

    const { likes, isCache } = await this._service.getAlbumLikes(id);

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });
    if (isCache) {
      response.header('X-Data-Source', 'cache');
    }
    response.code(200);
    return response;
  }
}

module.exports = AlbumHandler;
