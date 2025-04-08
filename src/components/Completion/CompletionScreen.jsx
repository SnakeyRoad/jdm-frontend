import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScoreContext } from '../../contexts/ScoreContext';
import { submitScores } from '../../utils/api';
import { downloadScoresAsCsv } from '../../utils/exportCsv';
import './CompletionScreen.css';
import Confetti from '../common/Confetti';

const CompletionScreen = ({ username, allTasks }) => {
  const navigate = useNavigate();
  const { scoreData, clearScores } = useScoreContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
  const [showEmojis, setShowEmojis] = useState([]);
  
  // Get scores array and calculate total score
  const scoresArray = Object.values(scoreData.scores).map(item => item.score);
  const validScores = scoresArray.filter(score => score !== null && score !== undefined);
  const totalScore = scoreData.metadata.totalScore || validScores.reduce((sum, score) => sum + score, 0);
  
  // Get the maximum possible score by summing up all task maxPoints
  const maxPossibleScore = allTasks.reduce((sum, task) => sum + (task.maxPoints || 0), 0);
  
  // Calculate score percentage
  const scorePercentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
  
  const hasValidScores = Object.keys(scoreData.scores).length > 0;

  // Show celebration animations on component mount
  useEffect(() => {
    setShowConfetti(true);
    
    const timer1 = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    
    const timer2 = setTimeout(() => {
      setAnimationDone(true);
    }, 1500);
    
    // Create animated emojis
    const emojis = ['🎉', '🌟', '💪', '🏆', '👏'];
    const animatedEmojis = emojis.map((emoji, index) => ({
      id: index,
      emoji,
      top: Math.random() * 60 + 10, // 10-70% from top
      left: Math.random() * 70 + 15, // 15-85% from left
      delay: Math.random() * 0.5
    }));
    setShowEmojis(animatedEmojis);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Handle scores submission
  const handleSubmit = async () => {
    if (!hasValidScores) {
      setSubmitStatus({
        type: 'error',
        message: 'No valid scores to submit. Please complete the tasks first.'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Format scores for submission
      const formattedScores = Object.entries(scoreData.scores).map(([key, value]) => ({
        taskId: value.id,
        score: value.score,
        taskName: allTasks[value.id]?.title || `Task ${value.id + 1}`
      }));
      
      const result = await submitScores(
        scoreData.metadata.username || username, 
        formattedScores
      );
      
      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Your scores have been saved successfully!'
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Failed to save scores. Please try again.'
        });
      }
    } catch (err) {
      setSubmitStatus({
        type: 'error',
        message: 'An unexpected error occurred. Your scores are still saved locally.'
      });
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle CSV export
  const handleExport = () => {
    if (!hasValidScores) {
      setSubmitStatus({
        type: 'error',
        message: 'No valid scores to export. Please complete the tasks first.'
      });
      return;
    }
    
    // Format scores for export
    const formattedScores = Object.entries(scoreData.scores).map(([key, value]) => ({
      taskId: value.id,
      score: value.score,
      taskName: allTasks[value.id]?.title || `Task ${value.id + 1}`
    }));
    
    downloadScoresAsCsv(scoreData.metadata.username || username, formattedScores);
  };

  // Handle return to login (clear scores and navigate to login)
  const handleReturnToLogin = () => {
    clearScores();
    navigate('/');
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
      
      {showEmojis.map(emoji => (
        <div
          key={emoji.id}
          className="absolute text-4xl float-animation"
          style={{
            top: `${emoji.top}%`,
            left: `${emoji.left}%`,
            animationDelay: `${emoji.delay}s`
          }}
        >
          {emoji.emoji}
        </div>
      ))}
      
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
      
      <div className="flex flex-col md:flex-row justify-center gap-4">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Saving...' : 'Save My Scores'}
        </button>
        
        <button
          onClick={handleExport}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors"
        >
          Download as CSV
        </button>
        
        <button
          onClick={handleReturnToLogin}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg shadow-md transition-colors"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default CompletionScreen;
