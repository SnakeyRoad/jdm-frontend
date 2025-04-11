import React, { useState, useEffect } from 'react';
import { useScoreContext } from '../../contexts/ScoreContext';
import './CompletionScreen.css';
import Confetti from '../common/Confetti';
import { saveScoreMeasurement } from '../../utils/api';

const CompletionScreen = ({ username, allTasks }) => {
  const { scoreData } = useScoreContext();
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const [animationDone, setAnimationDone] = useState(false);

  // Setup animations
  useEffect(() => {
    // Hide confetti after 5 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    // Complete banner animation after 1.5 seconds
    const animationTimer = setTimeout(() => {
      setAnimationDone(true);
    }, 1500);

    // Cleanup timers
    return () => {
      clearTimeout(confettiTimer);
      clearTimeout(animationTimer);
    };
  }, []);

  // Calculate scores
  const scoresArray = Object.values(scoreData.scores).map(item => item.score);
  const validScores = scoresArray.filter(score => score !== null && score !== undefined);
  const totalScore = scoreData.metadata.totalScore || validScores.reduce((sum, score) => sum + score, 0);
  const maxPossibleScore = allTasks.reduce((sum, task) => sum + (task.maxPoints || 0), 0);
  const scorePercentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

  // Handle save scores
  const handleSaveScores = async () => {
    try {
      await saveScoreMeasurement(username, totalScore);
      setSubmitStatus({
        type: 'success',
        message: 'Your scores have been saved successfully! Your doctor will be able to see your progress.'
      });
    } catch (err) {
      console.error('Error saving scores:', err);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to save scores. Please try again.'
      });
    }
  };

  // Get appropriate message based on score
  const getScoreMessage = () => {
    if (scorePercentage >= 90) return "Amazing job! You're super strong!";
    if (scorePercentage >= 75) return "Great work! You're getting stronger!";
    if (scorePercentage >= 50) return "Good job! Keep practicing!";
    return "You did it! Every exercise helps you get stronger!";
  };

  return (
    <div className="completion-screen bg-green-100 p-8 rounded-lg shadow-lg max-w-3xl w-full mx-auto text-center relative">
      {showConfetti && <Confetti count={50} />}
      
      <div className={`star-banner flex justify-center mb-6 ${animationDone ? 'banner-complete' : ''}`}>
        {[...Array(5)].map((_, i) => (
          <span key={i} role="img" aria-label="star" className="text-5xl mx-1 star-animation">⭐</span>
        ))}
      </div>
      
      <h2 className="text-3xl md:text-4xl font-comic text-green-800 mb-6 animate-bounce-in">
        All Done! Great Job!
      </h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <p className="text-xl mb-4">
          {getScoreMessage()}
        </p>
        
        <div className="score-display bg-yellow-50 p-4 rounded-md inline-block mb-4">
          <p className="text-lg font-bold text-purple-700 mb-4">
            Your total CMAS score: <span className="text-3xl text-green-600">{totalScore}</span> / {maxPossibleScore}
          </p>
          
          <div className="w-full bg-gray-200 h-6 rounded-full mb-4">
            <div
              className="bg-blue-500 h-6 rounded-full score-progress-bar"
              style={{ width: `${scorePercentage}%` }}
            ></div>
          </div>
          
          <div className="task-scores mt-4">
            <p className="font-medium text-gray-700 mb-2">Your individual task scores:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-left">
              {Object.entries(scoreData.scores).map(([key, value]) => (
                <div key={key} className="score-item p-2 rounded bg-white">
                  <p className="text-sm">
                    Task {value.id + 1}: <span className="font-bold text-blue-600">{value.score !== null ? value.score : '-'}</span>
                    {value.score > 0 && value.score === allTasks[value.id]?.maxPoints && 
                      <span className="ml-1 inline-block">🌟</span>
                    }
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {submitStatus && (
          <div className={`mb-4 p-3 rounded ${
            submitStatus.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {submitStatus.message}
          </div>
        )}
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={handleSaveScores}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors"
        >
          Save My Scores
        </button>
      </div>
    </div>
  );
};

export default CompletionScreen;
