import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query getUser($userId: ID!) {
    user(userId: $userId) {
      _id
      username
      email
    }
  }
`;

export const QUERY_USERS = gql`
  {
    users {
      _id
      username
      email
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
    }
  }
`;

export const QUERY_CONVERSATIONS = gql`
  query getConversations($senderId: ID!) {
    getConversations(senderId: $senderId) {
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
