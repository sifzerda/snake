import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import '../App.css';
import '../snake.css';

const Profile = () => {
    const { loading, data, error } = useQuery(QUERY_ME);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const user = data?.me;
    const snakeScores = user?.snakeScore || [];

    // Sort scores by highest minePoints, and then by least time taken if points are tied
    const sortedScores = [...snakeScores].sort((a, b) => {
        if (b.snakePoints !== a.snakePoints) {
            return b.snakePoints - a.snakePoints; // Sort by points descending
        } else {
            return a.snakeTimeTaken - b.snakeTimeTaken; // Sort by time ascending if points are tied
        }
    });

    // Limit to 10 scores
    const limitedScores = sortedScores.slice(0, 10);

    return (
        <div className="profile-container">
            <div className="jumbo-bg-dark">
                <h1 className='jumbo-bg-dark-text'>{user.username}'s Profile</h1>
            </div>
            <p className='black-text'>Email: {user.email}</p>
            <p className="email-info">Note: Your email cannot be seen by other users</p>
            <h2 className='profile-text'>Your Snake Highscores:</h2>
            
            {limitedScores.length === 0 ? (
                <p className="black-text">No high scores yet!</p>
            ) : (
                <div className='blue-background'>
                <table className="high-scores-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Score</th>
                            <th>Time (in Seconds)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {limitedScores.map((score, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{score.snakePoints}</td>
                                <td>{score.snakeTimeTaken}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            )}
        </div>
    );
};

export default Profile;