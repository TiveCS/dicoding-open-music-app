class UploadsHandler {
  constructor(storageService, validator) {
    this._storageService = storageService;
    this._validator = validator;
  }

  async postUploadImageHandler(request, h) {
    const { cover } = request.payload;

    this._validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);

    const response = h.response({
      status: 'success',
      data: {
        fileLocation: filename,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
