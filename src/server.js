require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

const albumsPlugin = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumsValidator = require('./validator/albums');

const songsPlugin = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

const usersPlugin = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const authPlugin = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

const playlistsPlugin = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');

const collaborationsPlugin = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

const init = async () => {
  // Albums
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService();
  const collaborationsService = new CollaborationsService();

  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: Jwt,
  });

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    validate: (artifacts) => {
      return {
        isValid: true,
        credentials: {
          id: artifacts.decoded.payload.id,
        },
      };
    },
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
  });

  await server.register([
    {
      plugin: usersPlugin,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authPlugin,
      options: {
        authenticationsService: authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: albumsPlugin,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songsPlugin,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: playlistsPlugin,
      options: {
        playlistsService,
        songsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: collaborationsPlugin,
      options: {
        collaborationsService,
        playlistsService,
        validator: CollaborationsValidator,
      },
    },
  ]);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();
