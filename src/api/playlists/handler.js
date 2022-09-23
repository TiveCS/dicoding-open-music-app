const handlerThrows = require('../../throwable/HandlerThrows');

class PlaylistsHandler {
  constructor(
    playlistsService,
    songsService,
    playlistSongActivitiesService,
    playlistValidator,
    activitiesValidator
  ) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._playlistSongActivitiesService = playlistSongActivitiesService;
    this._playlistValidator = playlistValidator;
    this._activitiesValidator = activitiesValidator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);

    this.postPlaylistSongsHandler = this.postPlaylistSongsHandler.bind(this);
    this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
    this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);

    this.getPlaylistSongActivitiesHandler = this.getPlaylistSongActivitiesHandler.bind(
      this
    );
  }

  // PLAYLIST HANDLER

  async postPlaylistHandler(request, h) {
    try {
      // Validate payload
      this._playlistValidator.validatePlaylistPayload(request.payload);

      const { name } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      const playlistId = await this._playlistsService.addPlaylist(
        name,
        credentialId
      );

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

      const playlists = await this._playlistsService.getPlaylists(credentialId);

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
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistOwner(id, credentialId);

      await this._playlistsService.deletePlaylist(id);

      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil dihapus.',
      });
      response.code(200);
      return response;
    } catch (error) {
      return handlerThrows(h, error);
    }
  }

  // --- END PLAYLIST HANDLER ---

  // PLAYLIST SONG HANDLER

  async postPlaylistSongsHandler(request, h) {
    try {
      const { id } = request.params;

      this._playlistValidator.validatePlaylistSongsPayload(request.payload);

      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistAccess(id, credentialId);

      await this._songsService.verifySongIsExists(songId);

      await this._playlistsService.addSongToPlaylist(id, songId);

      await this._playlistSongActivitiesService.addPlaylistSongActivity(
        id,
        credentialId,
        songId
      );

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      });
      response.code(201);

      return response;
    } catch (error) {
      return handlerThrows(h, error);
    }
  }

  async getPlaylistSongsHandler(request, h) {
    try {
      const { id } = request.params;

      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistAccess(id, credentialId);

      const playlist = await this._playlistsService.getPlaylistById(
        id,
        credentialId
      );
      const songs = await this._playlistsService.getSongsFromPlaylist(id);

      const response = h.response({
        status: 'success',
        data: {
          playlist: {
            ...playlist,
            songs,
          },
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      return handlerThrows(h, error);
    }
  }

  async deletePlaylistSongHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistAccess(id, credentialId);

      await this._playlistValidator.validatePlaylistSongsPayload(
        request.payload
      );

      const { songId } = request.payload;

      await this._playlistsService.deleteSongFromPlaylist(id, songId);

      await this._playlistSongActivitiesService.deletePlaylistSongActivity(
        id,
        credentialId,
        songId
      );

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      });
      response.code(200);
      return response;
    } catch (error) {
      return handlerThrows(h, error);
    }
  }

  // --- END PLAYLIST SONG HANDLER ---

  // PLAYLIST SONG ACTIVITIES HANDLER

  async getPlaylistSongActivitiesHandler(request, h) {
    try {
      const { id } = request.params;

      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistAccess(id, credentialId);

      const activities = await this._playlistSongActivitiesService.getPlaylistSongActivities(
        id
      );

      const response = h.response({
        status: 'success',
        data: {
          playlistId: id,
          activities,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      return handlerThrows(h, error);
    }
  }
}

module.exports = PlaylistsHandler;
