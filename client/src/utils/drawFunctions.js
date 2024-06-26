// src/utils/drawFunctions.js
export const drawClock = (canvasRef, setActualHour, setActualMinute) => {
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
  setActualHour(hour + 1); // +1 to adjust range from 1 to 12 for display
  setActualMinute(minute);

  drawHand(context, minute, radius, 0.8, 'red', centerX, centerY);
  drawHand(context, hour * 5 + minute / 12, radius * 0.6, 4, 'blue', centerX, centerY);
};

export const drawHand = (context, value, handLength, lineWidth, color, centerX, centerY) => {
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
