import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../common/ProgressBar';
import './Tasks.css';
import Confetti from '../common/Confetti';
import { playClickSound } from '../../utils/soundEffects';

const CmasTaskCard = ({ task, totalTasks, onComplete }) => {
  const navigate = useNavigate();
  const [numericValue, setNumericValue] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState('');
  const [showReward, setShowReward] = useState(false);
  const [animateCard, setAnimateCard] = useState(false);
  
  // Initialize animation state
  useEffect(() => {
    setAnimateCard(true);
    const timer = setTimeout(() => {
      setAnimateCard(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [task.id]);
  
  // Handle numeric input change
  const handleNumericChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setNumericValue(Math.max(0, value)); // Ensure non-negative
  };
  
  // Handle increment/decrement buttons
  const updateNumericValue = (delta) => {
    setNumericValue(prev => Math.max(0, prev + delta));
    playClickSound();
  };
  
  // Handle choice selection
  const handleChoiceSelect = (value) => {
    playClickSound();
    setSelectedChoice(value);
    
    // Show stars for high scores
    if (value > Math.floor(task.maxPoints * 0.7)) {
      setShowReward(true);
      setTimeout(() => setShowReward(false), 2000);
    }
  };
  
  // Handle multiselect option toggle
  const handleMultiSelectToggle = (optionId, value) => {
    playClickSound();
    setSelectedOptions(prev => {
      // Check if this option is already selected
      const isSelected = prev.find(item => item.id === optionId);
      
      if (isSelected) {
        // Remove the option
        return prev.filter(item => item.id !== optionId);
      } else {
        // Add the option
        return [...prev, { id: optionId, value }];
      }
    });
  };

  // Calculate multiselect total value
  const getMultiSelectValue = () => {
    return selectedOptions.reduce((sum, option) => sum + option.value, 0);
  };
  
  // Check if a multiselect option is selected
  const isOptionSelected = (optionId) => {
    return selectedOptions.some(item => item.id === optionId);
  };
  
// Modify the handleSubmit function in CmasTaskCard.jsx to remove the unused variable

const handleSubmit = () => {
  let scoreValue = 0;
  
  if (task.type === 'numeric') {
    if (numericValue === 0) {
      setError('Please enter a value greater than 0');
      return;
    }
    scoreValue = numericValue;
  } 
  else if (task.type === 'choice') {
    if (selectedChoice === null) {
      setError('Please select an option');
      return;
    }
    scoreValue = selectedChoice;
  }
  else if (task.type === 'multiselect') {
    const totalValue = getMultiSelectValue();
    if (selectedOptions.length === 0) {
      setError('Please select at least one option');
      return;
    }
    scoreValue = totalValue;
  }
  
  // Ensure score is a number
  scoreValue = Number(scoreValue);
  
  console.log(`Task ${task.id} completed with score: ${scoreValue}`);
  
  // Call the onComplete callback
  onComplete(task.id, scoreValue);
  
  // Navigate to next task or completion
  if (task.id < totalTasks - 1) {
    navigate(`/task/${task.id + 1}`);
  } else {
    navigate('/complete');
  }
};

  return (
    <div className={`task-card bg-gradient-to-b from-yellow-50 to-orange-50 p-8 rounded-3xl shadow-xl max-w-3xl w-full mx-auto ${animateCard ? 'animate-slide-in' : ''}`}>
      {showReward && <Confetti count={50} />}
      
      <h2 className="text-3xl font-bold text-blue-800 mb-4 font-comic">
        {task.title}
        <span className="ml-2 inline-block text-2xl animate-bounce">🎮</span>
      </h2>
      
      <ProgressBar current={task.id} total={totalTasks} />
      
      <div className="instruction bg-white p-6 rounded-2xl shadow-md mb-8 border-2 border-blue-100">
        <p className="text-xl text-gray-700 font-comic">{task.instruction}</p>
        {task.maxPoints && (
          <p className="text-sm text-blue-600 mt-3 font-bold">
            <span role="img" aria-label="star" className="animate-pulse">⭐</span> 
            <span className="ml-1">Max points: {task.maxPoints}</span>
          </p>
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 border-2 border-red-300 text-red-700 px-5 py-3 rounded-xl mb-6 animate-pulse">
          <span role="img" aria-label="warning" className="mr-2">⚠️</span>
          {error}
        </div>
      )}
      
      <div className="input-section mb-10">
        {task.type === 'numeric' ? (
          <div className="numeric-input flex items-center justify-center">
            <button 
              className="decrement-button bg-red-500 hover:bg-red-600 text-white font-bold text-2xl px-6 py-4 rounded-l-xl shadow-md transition-all"
              onClick={() => updateNumericValue(-1)}
              disabled={numericValue <= 0}
            >
              -
            </button>
            
            <div className="value-container mx-6 relative">
              <input
                type="number"
                min="0"
                value={numericValue}
                onChange={handleNumericChange}
                className="w-32 text-center text-4xl font-bold border-4 border-blue-300 rounded-xl py-3 px-4 shadow-inner"
              />
              {task.label && (
                <span className="label text-gray-600 ml-3 text-lg">{task.label}</span>
              )}
            </div>
            
            <button 
              className="increment-button bg-green-500 hover:bg-green-600 text-white font-bold text-2xl px-6 py-4 rounded-r-xl shadow-md transition-all"
              onClick={() => updateNumericValue(1)}
            >
              +
            </button>
          </div>
        ) : task.type === 'choice' ? (
          <div className="choice-input grid grid-cols-1 md:grid-cols-2 gap-4">
            {task.options.map((option) => (
              <button
                key={option.value}
                className={`choice-button p-5 rounded-2xl font-bold text-xl transition-all
                  ${selectedChoice === option.value
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white scale-105 shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 hover:scale-102 shadow-md border-2 border-blue-100'
                  }`}
                onClick={() => handleChoiceSelect(option.value)}
              >
                {option.label}
                {option.value > 0 && option.value >= Math.floor(task.maxPoints * 0.7) && (
                  <span className="ml-2" role="img" aria-label="star">
                    ⭐
                  </span>
                )}
              </button>
            ))}
          </div>
        ) : task.type === 'multiselect' ? (
          <div className="multiselect-input grid grid-cols-1 gap-4">
            {task.options.map((option) => (
              <button
                key={option.id}
                className={`multiselect-button p-5 rounded-2xl font-bold text-xl transition-all ${
                  isOptionSelected(option.id)
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white scale-105 shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 hover:scale-102 shadow-md border-2 border-blue-100'
                }`}
                onClick={() => handleMultiSelectToggle(option.id, option.value)}
              >
                {isOptionSelected(option.id) ? '✓ ' : '○ '}
                {option.label}
              </button>
            ))}
            <div className="mt-6 text-center text-xl font-bold text-blue-700 bg-blue-50 p-4 rounded-xl shadow-inner">
              Selected: {selectedOptions.length} | Points: {getMultiSelectValue()} / {task.maxPoints}
            </div>
          </div>
        ) : null}
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          className="next-button bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-2xl font-comic py-5 px-10 rounded-2xl shadow-xl transition-transform transform hover:scale-105 relative overflow-hidden"
        >
          <span className="relative z-10">
            {task.id < totalTasks - 1 ? (
              <>
                Next Task
                <span className="ml-2" role="img" aria-label="right-arrow">→</span>
              </>
            ) : (
              <>
                Finish Tasks
                <span className="ml-2" role="img" aria-label="check-mark">✓</span>
              </>
            )}
          </span>
          <div className="button-shine"></div>
        </button>
      </div>
    </div>
  );
};

export default CmasTaskCard;
