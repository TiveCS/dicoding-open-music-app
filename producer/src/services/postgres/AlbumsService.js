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
    const albumResult = await this._pool.query(
      'SELECT * FROM albums WHERE id = $1',
      [id]
    );

    if (!albumResult.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const songsResult = await this._pool.query(
      'SELECT id, title, performer FROM songs WHERE album_id = $1',
      [id]
    );

    const album = albumResult.rows[0];
    const songs = songsResult.rows;

    return { ...album, songs };
  }

  async editAlbumById(id, { name, year }) {
    const result = await this._pool.query(
      'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      [name, year, id]
    );

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const result = await this._pool.query(
      'DELETE FROM albums WHERE id = $1 RETURNING id',
      [id]
    );

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async editAlbumCoverById(id, filename) {
    const result = await this._pool.query(
      'UPDATE albums SET "coverUrl" = $1 WHERE id = $2 RETURNING id',
      [filename, id]
    );

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;
