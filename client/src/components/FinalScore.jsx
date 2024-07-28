import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import Auth from '../utils/auth';
import { QUERY_ME } from '../utils/queries';
import { SAVE_SNAKE_SCORE } from '../utils/mutations';
import '../App.css';

const FinalScore = ({ score, time, onViewHighScores }) => {
  const [snakePoints, setSnakePoints] = useState(score);
  const [snakeTimeTaken, setSnakeTimeTaken] = useState(time);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const { data, loading, error } = useQuery(QUERY_ME);

  useEffect(() => {
    if (error) {
      console.error('Error fetching user data:', error);
    }
  }, [error]);

  const userId = data?.me?._id;
  const username = data?.me?.username || 'Anonymous';

  const [saveSnakeScore] = useMutation(SAVE_SNAKE_SCORE);

  const handleSubmit = async () => {
    console.log('Submitting score...');
    console.log('User ID:', userId);
    console.log('Snake Points:', snakePoints);
    console.log('Snake Time Taken:', snakeTimeTaken);

    try {
      const { data } = await saveSnakeScore({
        variables: {
          userId,
          snakePoints: parseInt(snakePoints, 10),
          snakeTimeTaken: parseInt(snakeTimeTaken, 10),
        },
      });
      console.log('Mutation Response:', data);
      setShowSuccessMessage(true);
    } catch (error) {
      console.error('Error saving score:', error);
      if (error.networkError) {
        console.error('Network error details:', error.networkError);
        alert('Network error occurred while saving your score. Please try again.');
      } else if (error.graphQLErrors) {
        console.error('GraphQL error details:', error.graphQLErrors);
        alert('GraphQL error occurred while saving your score. Please check the logs for more details.');
      } else {
        alert('An unknown error occurred while saving your score.');
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="grid-container">
      <h1 className='start'>Game Over</h1>
      <p className='black-text'>Your final score: {score}</p>
      <p className='black-text'>Time taken: {time} seconds</p>

      {showSuccessMessage ? (
        <p className="success">Your score has been submitted!</p>
      ) : (
        Auth.loggedIn() ? (
          <button className="submit-button-m" onClick={handleSubmit}>
            Submit Score
          </button>
        ) : (
          <p className='black-text'>
            You must <Link to="/login">LOG IN</Link> or <Link to="/signup">SIGNUP</Link> to Submit a Score.
          </p>
        )
      )}

      <button className="submit-button-m" onClick={onViewHighScores}>
        High Scores
      </button>

      <button className="submit-button-y" onClick={() => window.location.reload()}>
        Back to Menu
      </button>
    </div>
  );
};

export default FinalScore;