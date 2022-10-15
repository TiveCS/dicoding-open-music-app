/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('albums', {
    coverUrl: {
      type: 'text',
      nullable: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('albums', ['coverUrl']);
};
