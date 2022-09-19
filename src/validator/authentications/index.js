const { PostAuthPayloadSchema, DeleteAuthPayloadSchema } = require('./schema');

const InvariantError = require('../../exceptions/InvariantError');

const AuthenticationsValidator = {
  validatePostAuthPayload: (payload) => {
    const validationResult = PostAuthPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteAuthPayload: (payload) => {
    const validationResult = DeleteAuthPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AuthenticationsValidator;
