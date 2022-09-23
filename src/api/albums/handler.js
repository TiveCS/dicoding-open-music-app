const handlerThrows = require('../../throwable/HandlerThrows');

class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postAlbumHandler(request, h) {
    try {
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
    } catch (error) {
      return handlerThrows(h, error);
    }
  }

  async getAlbumByIdHandler(request, h) {
    try {
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
    } catch (error) {
      return handlerThrows(h, error);
    }
  }

  async putAlbumByIdHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);

      const { id } = request.params;

      await this._service.editAlbumById(id, request.payload);

      const response = h.response({
        status: 'success',
        message: 'Album berhasil diperbarui',
      });
      response.code(200);

      return response;
    } catch (error) {
      return handlerThrows(h, error);
    }
  }

  async deleteAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;

      await this._service.deleteAlbumById(id);

      const response = h.response({
        status: 'success',
        message: 'Album berhasil dihapus',
      });
      response.code(200);

      return response;
    } catch (error) {
      return handlerThrows(h, error);
    }
  }
}

module.exports = AlbumHandler;
