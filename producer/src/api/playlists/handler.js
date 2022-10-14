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
  }

  // PLAYLIST HANDLER

  async postPlaylistHandler(request, h) {
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
  }

  async getPlaylistsHandler(request, h) {
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
  }

  async deletePlaylistHandler(request, h) {
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
  }

  // --- END PLAYLIST HANDLER ---

  // PLAYLIST SONG HANDLER

  async postPlaylistSongsHandler(request, h) {
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
  }

  async getPlaylistSongsHandler(request, h) {
    const { id } = request.params;

    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);

    const playlist = await this._playlistsService.getPlaylistById(id);
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
  }

  async deletePlaylistSongHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);

    await this._playlistValidator.validatePlaylistSongsPayload(request.payload);

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
  }

  // --- END PLAYLIST SONG HANDLER ---

  // PLAYLIST SONG ACTIVITIES HANDLER

  async getPlaylistSongActivitiesHandler(request, h) {
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
  }
}

module.exports = PlaylistsHandler;
