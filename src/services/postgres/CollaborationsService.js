const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const InvariantError = require('../../exceptions/InvariantError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaborator(playlistId, collaboratorId) {
    const id = `collaboration-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, collaboratorId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Kolaborasi gagal ditambahkan');
    }
  }

  async deleteCollaborator(playlistId, collaboratorId) {
    const query = {
      text:
        'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, collaboratorId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal dihapus');
    }
  }
}

module.exports = CollaborationsService;
