import { useEffect, useRef } from 'react';

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150; // Adjust if necessary

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the empty circle
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.stroke();

    // Generate random time for minute and hour hands
    const minute = Math.floor(Math.random() * 60); // 0 to 59
    const hour = Math.floor(Math.random() * 12); // 0 to 11

    // Draw minute hand
    drawHand(minute, radius, 0.8, 'red');

    // Draw hour hand
    drawHand(hour * 5 + minute / 12, radius * 0.6, 4, 'blue'); // hour * 5 converts hour position to equivalent minute position

    function drawHand(value, handLength, lineWidth, color) {
      const angle = (Math.PI * 2 * (value / 60)) - Math.PI / 2; // Adjusting by -90 degrees to start from 12 o'clock
      const handX = centerX + Math.cos(angle) * handLength;
      const handY = centerY + Math.sin(angle) * handLength;

      context.beginPath();
      context.moveTo(centerX, centerY);
      context.lineTo(handX, handY);
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      context.stroke();
    }
  }, []);

  return (
    <div className="App" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <canvas ref={canvasRef} width="400" height="400" style={{ backgroundColor: 'white' }} />
    </div>
  );
}

export default App;
