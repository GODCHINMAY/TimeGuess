import { useEffect, useRef } from 'react';

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = 'blue';
    context.beginPath();
    context.arc(100, 100, 50, 0, 2 * Math.PI);
    context.fill();
  }, []);

  return (
    <div className="App">
      <canvas ref={canvasRef} width="200" height="200" />
    </div>
  );
}

export default App;
