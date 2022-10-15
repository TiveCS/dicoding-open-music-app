/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('albums', {
    cover: {
      type: 'text',
      nullable: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('albums', ['cover']);
};
