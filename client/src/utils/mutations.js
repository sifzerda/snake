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

export const SAVE_SNAKE_SCORE = gql`
  mutation saveSnakeScore($userId: ID!, $snakePoints: Int!, $snakeTimeTaken: Int!) {
    saveSnakeScore(userId: $userId, snakePoints: $snakePoints, snakeTimeTaken: $snakeTimeTaken) {
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
 
 