// src/App.js
import React, { useState, useEffect } from 'react';
import ClockCanvas from './components/ClockCanvas';

function App() {
  const [actualHour, setActualHour] = useState(0);
  const [actualMinute, setActualMinute] = useState(0);
  const [guessHour, setGuessHour] = useState('');
  const [guessMinute, setGuessMinute] = useState('');
  const [results, setResults] = useState([]);
  const [round, setRound] = useState(1);
  const [timer, setTimer] = useState(15);
  const [gameStarted, setGameStarted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    if (gameStarted) {
      const interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer === 1) {
            clearInterval(interval);
            handleRoundEnd();
          }
          return prevTimer - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameStarted, round]);

  const handleRoundEnd = () => {
    const totalMinutesActual = (actualHour - 1) * 60 + actualMinute; // -1 to convert back to 0-11 range for calculation
    const totalMinutesGuess = (parseInt(guessHour) - 1) * 60 + parseInt(guessMinute);
    const diff = guessHour && guessMinute ? Math.abs(totalMinutesActual - totalMinutesGuess) : 1000;

    setResults(prevResults => [...prevResults, {
      round,
      actualTime: `${actualHour}:${actualMinute}`,
      guessedTime: `${guessHour || 'No guess'}:${guessMinute || 'No guess'}`,
      difference: diff
    }]);
    setTotalScore(prevScore => prevScore + diff);

    setGuessHour('');
    setGuessMinute('');

    if (round < 5) {
      setRound(round + 1);
      setTimer(15);
    } else {
      setGameStarted(false);
    }
  };

  const handleStartGame = () => {
    setResults([]);
    setRound(1);
    setTimer(15);
    setTotalScore(0);
    setGameStarted(true);
  };

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      {!gameStarted && (
        <>
          <h1>The Time Guessing Game</h1>
          <img src="/clock.jpg" alt="Clock" style={{ width: '300px', marginBottom: '20px' }} />
          <button onClick={handleStartGame}>Start Game</button>
        </>
      )}
      {gameStarted && (
        <>
          <ClockCanvas setActualHour={setActualHour} setActualMinute={setActualMinute} gameStarted={gameStarted} round={round} />
          <div>Round: {round} / 5</div>
          <div>Time Left: {timer} seconds</div>
          <form onSubmit={e => {
            e.preventDefault();
            handleRoundEnd();
          }}>
            <input
              type="number"
              value={guessHour}
              onChange={e => setGuessHour(e.target.value)}
              placeholder="Guess Hour (1-12)"
              style={{ marginRight: '10px', width: '150px', height: '30px' }}
              max="12"
              min="1"
            />
            <input
              type="number"
              value={guessMinute}
              onChange={e => setGuessMinute(e.target.value)}
              placeholder="Guess Minute (0-59)"
              style={{ marginRight: '10px', width: '150px', height: '30px' }}
              max="59"
              min="0"
            />
            <button type="submit" style={{ height: '30px' }}>Submit Guess</button>
          </form>
        </>
      )}
      {results.length === 5 && (
        <>
          <h2>Game Over! Here are your results:</h2>
          <ul>
            {results.map((result, index) => (
              <li key={index}>
                Round {result.round}: Actual Time: {result.actualTime}, Your Guess: {result.guessedTime}, Difference: {result.difference} minutes
              </li>
            ))}
          </ul>
          <h2>Total Score: {totalScore} minutes</h2>
          <button onClick={handleStartGame}>Play Again</button>
        </>
      )}
    </div>
  );
}

export default App;
