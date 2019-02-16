const { ApolloServer, gql } = require('apollo-server-express')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const spawnServer = () => {
  const schema = gql`
    type Query {
      me: User
    }

    type User {
      username: String!
    }
  `

  const resolvers = {
    Query: {
      me: () => {
        return {
          username: 'Geoffrey Hug'
        }
      }
    }
  }

  const app = express()

  app.use(cors())

  app.use(
    "/graphql",
    bodyParser.json()
  )

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    uploads: false,
    introspection: true,
    playground: true,
  })

  server.applyMiddleware({ app })

  return app
}



module.exports = spawnServer
