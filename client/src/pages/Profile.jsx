import { useQuery } from '@apollo/client';
import { QUERY_ME, QUERY_CONVERSATIONS } from '../utils/queries';
import '../App.css';
import '../snake.css';

const Profile = () => {
    // Fetch user data
    const { loading: userLoading, data: userData, error: userError } = useQuery(QUERY_ME);

    // Get user information
    const user = userData?.me;
    const userId = user?._id;

    // Fetch conversations if user is loaded
    const { loading: conversationsLoading, data: conversationsData, error: conversationsError } = useQuery(QUERY_CONVERSATIONS, {
        skip: !userId, // Skip query if userId is not available
        variables: { senderId: userId },
    });

    if (userLoading || conversationsLoading) return <p>Loading...</p>;
    if (userError) return <p>Error: {userError.message}</p>;
    if (conversationsError) return <p>Error: {conversationsError.message}</p>;

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
            
            {conversationsData?.getConversations.length === 0 ? (
                <p className="black-text">No conversations yet!</p>
            ) : (
                <div className="conversations">
                    {conversationsData.getConversations.map((conv) => (
                        <div key={conv._id} className="conversation">
                            <p className="black-text"><strong>{conv.sender.username}</strong>: {conv.message}</p>
                            <p className="black-text"><em>{new Date(conv.timestamp).toLocaleString()}</em></p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Profile;