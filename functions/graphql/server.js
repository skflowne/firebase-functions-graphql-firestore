const { ApolloServer, gql } = require('apollo-server-express')
const express = require('express')
const cors = require('cors')

const db = require('../firebase')
const schema = require('./schema')
const resolvers = require('./resolvers')

const spawnServer = () => {

  const app = express()

  app.use(cors())

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    uploads: false,
    introspection: true,
    playground: true,
    context: {
      db
    }
  })

  server.applyMiddleware({ app })

  return app
}



module.exports = spawnServer
