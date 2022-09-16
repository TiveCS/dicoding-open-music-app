const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, performer, genre, duration, albumId }) {
    const id = 'song-' + nanoid(16);

    console.log({ id, title, year, performer, genre, duration, albumId });

    const result = await this._pool.query(
      'INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [id, title, year, performer, genre, duration, albumId]
    );

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query(
      'SELECT id, title, performer FROM songs'
    );

    return result.rows;
  }

  async getSongById(id) {
    const result = await this._pool.query('SELECT * FROM songs WHERE id = $1', [
      id,
    ]);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows[0];
  }
}

module.exports = SongsService;
