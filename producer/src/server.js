require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

const ClientError = require('./exceptions/ClientError');

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

const PlaylistSongActivitiesService = require('./services/postgres/PlaylistSongActivitiesService');
const PlaylistActivitiesValidator = require('./validator/playlistActivities');

const collaborationsPlugin = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

const exportPlugin = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportValidator = require('./validator/exports');

const uploadsPlugin = require('./api/uploads');
const StorageService = require('./services/S3/StorageService');
const UploadsValidator = require('./validator/uploads');

const CacheService = require('./services/redis/CacheService');

const init = async () => {
  const cacheService = new CacheService();

  // Albums
  const albumsService = new AlbumsService(cacheService);
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();

  const playlistsService = new PlaylistsService();
  const playlistSongActivitiesService = new PlaylistSongActivitiesService();

  const collaborationsService = new CollaborationsService();

  const storageService = new StorageService();

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

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const failResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        failResponse.code(response.statusCode);
        return failResponse;
      }
      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue;
      }
      // penanganan server error sesuai kebutuhan
      const errorResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      errorResponse.code(500);
      return errorResponse;
    }
    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
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
        playlistSongActivitiesService,
        playlistValidator: PlaylistsValidator,
        activitiesValidator: PlaylistActivitiesValidator,
      },
    },
    {
      plugin: collaborationsPlugin,
      options: {
        collaborationsService,
        playlistsService,
        usersService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: exportPlugin,
      options: {
        producerService: ProducerService,
        validator: ExportValidator,
        playlistsService: playlistsService,
      },
    },
    {
      plugin: uploadsPlugin,
      options: {
        storageService,
        albumsService,
        validator: UploadsValidator,
      },
    },
  ]);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();
