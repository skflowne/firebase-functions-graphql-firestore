const { gql } = require('apollo-server-express')

const userSchema = gql`
  extend type Query {
    me: User,
    users: [User],
    user(uid: String!): User
  }

  extend type Mutation {
    signIn(email: String!, password: String!): Token!,
    googleSignIn(token: String!): Token!,
    signUp(email: String!, password: String!, pwdConfirmation: String!, displayName: String ): Token!,
    setAdmin(userId: String!, isAdmin: Boolean!): Boolean
  }

  type User {
    uid: String!,
    email: String!,
    displayName: String,
    photoURL: String,
    phoneNumber: String,
    disabled: Boolean,
  }

  type Token {
    token: String!
  }
`

module.exports = userSchema
