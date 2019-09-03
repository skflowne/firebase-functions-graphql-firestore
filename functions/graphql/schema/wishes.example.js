const { gql } = require('apollo-server-express')

const newSchema = gql`
    type Wish {
        id: ID!,
        name: String!,
        price: Float!
    }
    
    extend type Query {
        wishes: [Wish],
        wish(id: ID!): Wish!,
    }
    
    extend type Mutation {
        addWish(name: String!, price: Float!): ID!,
        editWish(id: ID!, name: String!, price: Float!): Wish!,
        removeWishes(ids: [ID]!): Boolean!
    }
`

module.exports = newSchema