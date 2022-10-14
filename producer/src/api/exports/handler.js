class ExportHandler {
  constructor(producerService, playlistsService, validator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._validator = validator;
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);

    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistIsExists(playlistId);

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    const message = {
      userId: request.auth.credentials.id,
      targetEmail: request.payload.targetEmail,
      playlistId,
    };

    await this._producerService.sendMessage(
      'export:playlists',
      JSON.stringify(message)
    );

    const response = h.response({
      status: 'success',
      message: 'Permintaan berada didalam antrean.',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportHandler;
