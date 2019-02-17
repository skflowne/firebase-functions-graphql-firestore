const { gql } = require('apollo-server-express')

const userSchema = gql`
  extend type Query {
    users: [User],
  }

  type User {
    username: String!,
    email: String!
  }
`

module.exports = userSchema
