const routes = (handler) => [
  {
    method: 'GET',
    path: '/albums',
    handler: function (request, h) {
      return 'Hello world';
    },
  },
];

module.exports = routes;
