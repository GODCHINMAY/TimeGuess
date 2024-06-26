// src/components/ScoreBoard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const ScoreBoard = ({ totalScore }) => {
  const [allScores, setAllScores] = useState([]);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    fetchAllScores();
  }, []);

  useEffect(() => {
    if (allScores.length > 0) {
      calculatePercentage(allScores, totalScore);
    }
  }, [allScores, totalScore]);

  const fetchAllScores = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get_scores');
      const scores = response.data.map(score => score.total_score);
      setAllScores(scores);
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  };

  const calculatePercentage = (scores, currentScore) => {
    const betterScores = scores.filter(score => score > currentScore).length;
    const percentage = ((betterScores / scores.length) * 100).toFixed(2);
    setPercentage(percentage);
  };

  const histogramData = {
    labels: allScores.map((score, index) => `Player ${index + 1}`),
    datasets: [{
      label: 'Scores',
      data: allScores,
      backgroundColor: 'rgba(75, 192, 192, 0.6)'
    }]
  };

  return (
    <div>
      {allScores.length > 0 && (
        <>
          <Bar data={histogramData} />
          <h2>You did better than {percentage}% of other players</h2>
        </>
      )}
    </div>
  );
};

export default ScoreBoard;
