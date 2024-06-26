import React, { useState, useEffect, useRef } from 'react';

function App() {
  const canvasRef = useRef(null);
  const [actualHour, setActualHour] = useState(0);
  const [actualMinute, setActualMinute] = useState(0);
  const [guessHour, setGuessHour] = useState('');
  const [guessMinute, setGuessMinute] = useState('');
  const [results, setResults] = useState([]);
  const [round, setRound] = useState(1);
  const [timer, setTimer] = useState(15);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      drawClock();
      const interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer === 1) {
            clearInterval(interval);
            if (round < 5) {
              handleRoundEnd();
              setTimer(15);
              setRound(round + 1);
            } else {
              handleRoundEnd();
              setGameStarted(false);
            }
          }
          return prevTimer - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameStarted, round]);

  const drawClock = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.stroke();

    const minute = Math.floor(Math.random() * 60);
    const hour = Math.floor(Math.random() * 12);
    setActualHour(hour);
    setActualMinute(minute);

    drawHand(minute, radius, 0.8, 'red');
    drawHand(hour * 5 + minute / 12, radius * 0.6, 4, 'blue');
  };

  const drawHand = (value, handLength, lineWidth, color) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const angle = (Math.PI * 2 * (value / 60)) - Math.PI / 2;
    const handX = centerX + Math.cos(angle) * handLength;
    const handY = centerY + Math.sin(angle) * handLength;

    context.beginPath();
    context.moveTo(centerX, centerY);
    context.lineTo(handX, handY);
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.stroke();
  };

  const handleStartGame = () => {
    setResults([]);
    setRound(1);
    setTimer(15);
    setGameStarted(true);
  };

  const handleRoundEnd = () => {
    const totalMinutesActual = actualHour * 60 + actualMinute;
    const totalMinutesGuess = parseInt(guessHour) * 60 + parseInt(guessMinute);
    const diff = Math.abs(totalMinutesActual - totalMinutesGuess);

    setResults(prevResults => [...prevResults, {
      round,
      actualTime: `${actualHour}:${actualMinute}`,
      guessedTime: `${guessHour}:${guessMinute}`,
      difference: diff
    }]);
    setGuessHour('');
    setGuessMinute('');
  };

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      {!gameStarted && <h1>The Time Guessing Game</h1>}
      <canvas ref={canvasRef} width="400" height="400" style={{ backgroundColor: 'white', marginBottom: '20px' }} />
      <div>Round: {round} / 5</div>
      <div>Time Left: {timer} seconds</div>
      {!gameStarted ? (
        <button onClick={handleStartGame}>Start Game</button>
      ) : (
        <form onSubmit={e => {
          e.preventDefault();
          handleRoundEnd();
          if (round === 5) {
            setGameStarted(false);
          } else {
            setRound(round + 1);
            setTimer(15);
            drawClock();
          }
        }}>
          <input
            type="number"
            value={guessHour}
            onChange={e => setGuessHour(e.target.value)}
            placeholder="Guess Hour (0-11)"
            style={{ marginRight: '10px' }}
            max="11"
            min="0"
          />
          <input
            type="number"
            value={guessMinute}
            onChange={e => setGuessMinute(e.target.value)}
            placeholder="Guess Minute (0-59)"
            max="59"
            min="0"
          />
          <button type="submit">Submit Guess</button>
        </form>
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
          <button onClick={handleStartGame}>Play Again</button>
        </>
      )}
    </div>
  );
}

export default App;
