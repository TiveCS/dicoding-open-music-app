const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist(name, ownerId) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, ownerId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(userId) {
    const query = {
      text: `
        SELECT
          playlists.id,
          playlists.name,
          users.username
        FROM
          playlists
          LEFT JOIN users ON playlists.owner = users.id
          LEFT JOIN collaborations AS collab ON collab.playlist_id = playlists.id
        WHERE
          users.id = $1 OR collab.user_id = $1;`,
      values: [userId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async getPlaylistById(id) {
    const query = {
      text:
        'SELECT p.id, p.name, u.username FROM playlists AS p LEFT JOIN users AS u ON p.owner = u.id WHERE p.id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows[0];
  }

  async deletePlaylist(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `playlist_song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan lagu ke playlist.');
    }
  }

  async getSongsFromPlaylist(playlistId) {
    const query = {
      text:
        'SELECT songs.id, songs.title, songs.performer FROM playlist_songs LEFT JOIN songs ON playlist_songs.song_id = songs.id WHERE playlist_songs.playlist_id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text:
        'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal dihapus dari playlist');
    }
  }

  async verifyPlaylistOwner(playlistId, ownerId) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const owner = result.rows[0].owner;

    if (owner !== ownerId) {
      throw new AuthorizationError('Tidak memiliki akses untuk playlist ini.');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    const result = await this._pool.query(
      'SELECT id FROM playlists WHERE id = $1',
      [playlistId]
    );

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const collaboratorResult = await this._pool.query(
      `
      SELECT
        playlists.id, playlists.owner, collab.user_id
      FROM
        playlists
        LEFT JOIN collaborations AS collab ON playlists.id = collab.playlist_id
      WHERE
        playlists.id = $1 AND
        (playlists.owner = $2 OR collab.user_id = $2);
      `,
      [playlistId, userId]
    );

    if (!collaboratorResult.rowCount) {
      throw new AuthorizationError('Tidak memiliki akses untuk playlist ini.');
    }
  }

  async verifyPlaylistIsExists(playlistId) {
    const result = await this._pool.query(
      'SELECT id FROM playlists WHERE id = $1',
      [playlistId]
    );

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
  }
}

module.exports = PlaylistsService;
