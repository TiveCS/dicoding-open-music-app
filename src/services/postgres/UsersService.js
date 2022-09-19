const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { nanoid } = require('nanoid');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    // Verifikasi username sudah ada atau tidak.
    const user = await this.getUserByUsername(username);

    if (user) {
      throw new InvariantError(
        'Gagal menambahkan user. Username sudah digunakan.'
      );
    }

    // Hashing password.
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Menambahkan user ke database.
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('User gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getUserById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows[0];
  }

  async getUserByUsername(username) {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }
}

module.exports = UsersService;
