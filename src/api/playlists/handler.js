const handlerThrows = require('../../throwable/HandlerThrows');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    try {
      // Validate payload
      this._validator.validatePlaylistPayload(request.payload);

      const { name } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      const playlistId = await this._service.addPlaylist(name, credentialId);

      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return handlerThrows(h, error);
    }
  }

  async getPlaylistsHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;

      const playlists = await this._service.getPlaylists(credentialId);

      const response = h.response({
        status: 'success',
        data: {
          playlists,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      return handlerThrows(h, error);
    }
  }

  async deletePlaylistHandler(request, h) {
    try {
      const { id } = request.params;

      await this._service.deletePlaylist(id);

      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil dihapus.',
      });
      response.code(201);
      return response;
    } catch (error) {
      return handlerThrows(h, error);
    }
  }
}

module.exports = PlaylistsHandler;
