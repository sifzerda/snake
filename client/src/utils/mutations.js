import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const REMOVE_USER = gql`
  mutation removeUser {
    removeUser {
      _id
      username
    }
  }
`;

export const MUTATION_SEND_MESSAGE = gql`
  mutation sendMessage($senderId: ID!, $message: String!) {
    sendMessage(senderId: $senderId, message: $message) {
      _id
      sender {
        _id
        username
      }

      message
      timestamp
    }
  }
`;

export const MUTATION_SAVE_CONVERSATION = gql`
  mutation saveConversation($messages: [MessageInput!]!) {
    saveConversation(messages: $messages) {
      _id
      sender {
        _id
        username
      }

      message
      timestamp
    }
  }
`;