const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    snakeScore: [SnakeScore]
  }

    type SnakeScore {
    snakePoints: Int
    snakeTimeTaken: Int
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    user(userId: ID!): User
    users: [User]
    me: User
    getSnakeScore(userId: ID!): [SnakeScore]
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    updateUser(username: String, email: String, password: String, snakePoints: Int, snakeTime: Int): User
    login(email: String!, password: String!): Auth
    removeUser: User
    saveSnakeScore(userId: ID!, snakePoints: Int!, snakeTimeTaken: Int!): User
  }
`;

module.exports = typeDefs;