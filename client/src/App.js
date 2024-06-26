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

  useEffect(() => {
    drawClock();
    const interval = setInterval(() => {
      setTimer(t => {
        if (t === 1) {
          clearInterval(interval);
          handleRoundEnd();
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [round]);

  const drawClock = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the empty circle
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.stroke();

    // Generate random time for minute and hour hands
    const minute = Math.floor(Math.random() * 60);
    const hour = Math.floor(Math.random() * 12);
    setActualHour(hour);
    setActualMinute(minute);

    // Draw minute hand
    drawHand(minute, radius, 0.8, 'red');

    // Draw hour hand
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

  const handleRoundEnd = () => {
    const totalMinutesActual = actualHour * 60 + actualMinute;
    const totalMinutesGuess = parseInt(guessHour) * 60 + parseInt(guessMinute);
    const diff = Math.abs(totalMinutesActual - totalMinutesGuess);

    const newResult = {
      round: round,
      actualTime: `${actualHour}:${actualMinute}`,
      guessedTime: `${guessHour}:${guessMinute}`,
      difference: diff
    };
    setResults(prev => [...prev, newResult]);

    if (round < 5) {
      setRound(round + 1);
      setTimer(15);
      drawClock();
      setGuessHour('');
      setGuessMinute('');
    }
  };

  const handleReset = () => {
    setResults([]);
    setRound(1);
    setTimer(15);
    drawClock();
  };

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <canvas ref={canvasRef} width="400" height="400" style={{ backgroundColor: 'white', marginBottom: '20px' }} />
      <div>Time Left: {timer} seconds</div>
      {round <= 5 ?
        <form onSubmit={e => {
          e.preventDefault();
          handleRoundEnd();
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
      : <>
          <h2>Game Over! Here are your results:</h2>
          <ul>
            {results.map((result, index) => (
              <li key={index}>
                Round {result.round}: Actual Time: {result.actualTime}, Your Guess: {result.guessedTime}, Difference: {result.difference} minutes
              </li>
            ))}
          </ul>
          <button onClick={handleReset}>Play Again</button>
        </>
      }
    </div>
  );
}

export default App;
