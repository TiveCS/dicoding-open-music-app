const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistById(playlistId) {
    const query = {
      text: `SELECT p.id, p.name, u.username FROM playlists AS p LEFT JOIN users AS u ON p.owner = u.id WHERE p.id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
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
}

module.exports = PlaylistsService;
