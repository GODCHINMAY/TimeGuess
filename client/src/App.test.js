import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock('axios');

describe('App Component', () => {
  test('renders start button', () => {
    render(<App />);
    const startButton = screen.getByText(/Start Game/i);
    expect(startButton).toBeInTheDocument();
  });

  test('starts game and renders clock', () => {
    render(<App />);
    const startButton = screen.getByText(/Start Game/i);
    fireEvent.click(startButton);

    expect(screen.getByText(/Round: 1 \/ 5/i)).toBeInTheDocument();
    expect(screen.getByText(/Time Left:/i)).toBeInTheDocument();
  });

  test('submits guess and progresses to next round', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Score added successfully!' } });

    render(<App />);
    const startButton = screen.getByText(/Start Game/i);
    fireEvent.click(startButton);

    const guessHourInput = screen.getByPlaceholderText(/Guess Hour \(1-12\)/i);
    const guessMinuteInput = screen.getByPlaceholderText(/Guess Minute \(0-59\)/i);
    const submitButton = screen.getByText(/Submit Guess/i);

    fireEvent.change(guessHourInput, { target: { value: '5' } });
    fireEvent.change(guessMinuteInput, { target: { value: '30' } });
    fireEvent.click(submitButton);

    expect(screen.getByText(/Round: 2 \/ 5/i)).toBeInTheDocument();
  });

  test('displays game over and score board', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Score added successfully!' } });
    axios.get.mockResolvedValue({ data: [{ id: 1, total_score: 500 }] });

    render(<App />);
    const startButton = screen.getByText(/Start Game/i);
    fireEvent.click(startButton);

    for (let round = 1; round <= 5; round++) {
      const guessHourInput = screen.getByPlaceholderText(/Guess Hour \(1-12\)/i);
      const guessMinuteInput = screen.getByPlaceholderText(/Guess Minute \(0-59\)/i);
      const submitButton = screen.getByText(/Submit Guess/i);

      fireEvent.change(guessHourInput, { target: { value: '5' } });
      fireEvent.change(guessMinuteInput, { target: { value: '30' } });
      fireEvent.click(submitButton);
    }

    expect(screen.getByText(/Game Over! Here are your results:/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Score: \d+ minutes/i)).toBeInTheDocument();
    expect(screen.getByText(/You did better than/i)).toBeInTheDocument();
  });
});
