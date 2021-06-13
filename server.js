const fastify = require('fastify')
const { join } = require('path')

const api = require('./api')
const packageJson = require('./package.json')

const server = fastify({
  logger: true,
  ignoreTrailingSlash: true
})

server.register(require('fastify-helmet'), {
  contentSecurityPolicy: false
})
server.register(require('point-of-view'), {
  engine: {
    handlebars: require('handlebars')
  }
})
server.register(require('fastify-static'), {
  root: join(__dirname, 'public')
})
server.register(require('fastify-sensible'))
server.register(require('fastify-cors'))

server.get('/', function (request, reply) {
  reply.view('index.hbs', {
    version: packageJson.version
  })
})

server.get('/favicon.png', function (request, reply) {
  reply.sendFile('favicon.png')
})

server.get('/api/v1', api.v1)
server.get('/api/v1/:filter/:value', api.v1)

server.listen(process.env.PORT || 3000, '0.0.0.0', function (err, address) {
  if (err) {
    console.log(err)
  }
})
