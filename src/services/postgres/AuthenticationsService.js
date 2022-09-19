const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const AuthenticationError = require('../../exceptions/AuthenticationError');
const InvariantError = require('../../exceptions/InvariantError');

class AuthenticationsService {
  constructor(tokenManager) {
    this._pool = new Pool();
    this._tokenManager = tokenManager;
  }

  async addRefreshToken(refreshToken) {
    const query = {
      text: 'INSERT INTO refresh_token VALUES($1)',
      values: [refreshToken],
    };

    await this._pool.query(query);
  }

  async verifyRefreshToken(refreshToken) {
    const query = {
      text: 'SELECT * FROM refresh_token WHERE token = $1',
      values: [refreshToken],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async deleteRefreshToken(refreshToken) {
    const query = {
      text: 'DELETE FROM refresh_token WHERE token = $1',
      values: [refreshToken],
    };

    await this._pool.query(query);
  }

  async verifyUserCredentials(username, password) {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const { id, password: hashedPassword } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    return id;
  }
}

module.exports = AuthenticationsService;
