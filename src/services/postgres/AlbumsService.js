const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const InvariantError = require('../../exceptions/InvariantError');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = 'album-' + nanoid(16);

    const result = await this._pool.query(
      'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      [id, name, year]
    );

    if (!result.rows[0].id) {
      throw InvariantError('Gagal menambahkan album.');
    }

    return result.rows[0].id;
  }

  async getAlbums() {}
}

module.exports = AlbumsService;
