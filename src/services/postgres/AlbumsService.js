const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

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

  async getAlbumById(id) {
    const result = await this._pool.query(
      'SELECT * FROM albums WHERE id = $1',
      [id]
    );

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result.rows[0];
  }
}

module.exports = AlbumsService;
