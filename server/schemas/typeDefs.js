const typeDefs = `

  type User {
    _id: ID
    username: String
    email: String
    password: String
  }

  type Conversation {
  _id: ID!
  sender: User!
  message: String!
  timestamp: String!
}

  type Auth {
    token: ID!
    user: User
  }

  input MessageInput {
  senderId: ID!
  message: String!
}

  type Query {
    user(userId: ID!): User
    users: [User]
    me: User
    getConversations(senderId: ID!): [Conversation]
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    updateUser(username: String, email: String, password: String): User
    login(email: String!, password: String!): Auth
    removeUser: User
    sendMessage(senderId: ID!, message: String!): Conversation
    saveConversation(messages: [MessageInput!]!): [Conversation]
    }
`;

module.exports = typeDefs;
