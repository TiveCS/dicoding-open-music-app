class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {}

  async getSongsHandler(request, h) {
    return 'Hello world';
  }

  async getSongByIdHandler(request, h) {}
}

module.exports = SongsHandler;
