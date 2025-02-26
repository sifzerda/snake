import '../App.css'; // Assuming App.css is your stylesheet for styling

const StartGame = ({ onStartGame, onViewHighScores }) => {
  return (
    <div className="grid-container">
      <h1 className='start'>MAIN MENU</h1>
      <button className="submit-button-m" onClick={onStartGame}>Start Game</button>
      <button className="submit-button-m" onClick={onViewHighScores}>High Scores</button>
    </div>
  );
};

export default StartGame;