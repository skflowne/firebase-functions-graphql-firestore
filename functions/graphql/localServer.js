const spawnServer = require('./server')

const server = spawnServer()

server.listen({ port: 8000 }, () => {
  console.log('Running at http://localhost:8000/graphql')
})
