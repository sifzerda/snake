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
      snakeScore {
        snakePoints
        snakeTimeTaken
      }
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
            snakeScore {
        snakePoints
        snakeTimeTaken
      }
    }
  }
`;

export const GET_SNAKE_SCORE = gql`
  query getSnakeScore($userId: ID!) {
    getSnakeScore(userId: $userId) {
      snakePoints
      snakeTimeTaken
    }
  }
`;