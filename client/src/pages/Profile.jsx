import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import '../App.css';
import '../snake.css';

const Profile = () => {
    // Fetch user data
    const { loading, data: userData, error } = useQuery(QUERY_ME);

    // Get user information
    const user = userData?.me;

//    const mineScores = user?.mineScore || [];

    // Sort scores by highest minePoints, and then by least time taken if points are tied
//    const sortedScores = [...mineScores].sort((a, b) => {
//        if (b.minePoints !== a.minePoints) {
//            return b.minePoints - a.minePoints; // Sort by points descending
//        } else {
//            return a.mineTimeTaken - b.mineTimeTaken; // Sort by time ascending if points are tied
//        }
//    });

    // Limit to 10 scores
//    const limitedScores = sortedScores.slice(0, 10);

    return (
        <div className="profile-container">
            <div className="jumbo-bg-dark">
                <h1 className='jumbo-bg-dark-text'>{user.username}'s Profile</h1>
            </div>
            <p className='black-text'>Email: {user.email}</p>
            <p className="email-info">Note: Your email cannot be seen by other users</p>

            
            <h2 className='profile-text'>Your Conversations:</h2>
            
 
        </div>
    );
};

export default Profile;