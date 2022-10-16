const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSongActivity(playlistId, userId, songId) {
    const id = `playlist_song_activity-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text:
        'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, userId, songId, 'add', createdAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist song activity gagal ditambahkan');
    }
  }

  async deletePlaylistSongActivity(playlistId, userId, songId) {
    const id = `playlist_song_activity-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text:
        'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, userId, songId, 'delete', createdAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist song activity gagal dihapus');
    }
  }

  async getPlaylistSongActivities(playlistId) {
    const query = {
      text: `
      SELECT 
        users.username, 
        songs.title, 
        psa.action, 
        psa.time
      FROM playlist_song_activities AS psa
        LEFT JOIN users ON psa.user_id = users.id 
        LEFT JOIN songs ON psa.song_id = songs.id 
      WHERE 
        psa.playlist_id = $1;`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = PlaylistSongActivitiesService;
