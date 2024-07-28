import '../App.css'; // Assuming App.css is your stylesheet for styling
import { useQuery } from '@apollo/client';
import { QUERY_USERS } from '../utils/queries';

const HighScores = () => {
  const { loading, data, error } = useQuery(QUERY_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const users = data.users; // Extracting users from query data

  // Aggregate all snakeScore entries with associated usernames
  let allScores = [];
  users.forEach(user => {
    user.snakeScore.forEach(score => {
      allScores.push({
        username: user.username,
        snakePoints: score.snakePoints,
        snakeTimeTaken: score.snakeTimeTaken,
      });
    });
  });

  // Sort combined scores by snakePoints in descending order
  // If points are the same, then sort by snakeTimeTaken in ascending order
  allScores.sort((a, b) => {
    if (b.snakePoints !== a.snakePoints) {
      return b.snakePoints - a.snakePoints; // Sort by points descending
    } else {
      return a.snakeTimeTaken - b.snakeTimeTaken; // Sort by time ascending if points are tied
    }
});

// Limit to top 20 scores
const top20Scores = allScores.slice(0, 20);

return (
    <div className="grid-container">
      <h1 className='end'>High Scores</h1>
      <table className="high-scores-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Score</th>
            <th>Seconds</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {top20Scores.map((score, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{score.snakePoints}</td>
              <td>{score.snakeTimeTaken}</td>
              <td>{score.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="submit-button-m" onClick={() => window.location.reload()}>Back to Game</button>
    </div>
  );
};

export default HighScores;