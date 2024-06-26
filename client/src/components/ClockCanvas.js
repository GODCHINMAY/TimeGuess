// src/components/ClockCanvas.js
import React, { useRef, useEffect } from 'react';
import { drawClock } from '../utils/drawFunctions';

const ClockCanvas = ({ setActualHour, setActualMinute, gameStarted, round }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (gameStarted) {
      drawClock(canvasRef, setActualHour, setActualMinute);
    }
  }, [gameStarted, round, setActualHour, setActualMinute]);

  return <canvas ref={canvasRef} width="400" height="400" style={{ backgroundColor: 'white', marginBottom: '20px' }} />;
};

export default ClockCanvas;
