import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context with a default value
export const ScoreContext = createContext({
  scoreData: {
    scores: {},
    metadata: {
      totalScore: 0,
      maxPossibleScore: 52,
      lastUpdated: null,
      username: ''
    }
  },
  setScoreForTask: () => {},
  clearScores: () => {},
  updateUsername: () => {},
  getScoresArray: () => [],
  calculateTotalScore: () => 0,
  exportScoresAsCsv: () => null
});

// Custom hook to use the score context
export const useScoreContext = () => {
  const context = useContext(ScoreContext);
  if (!context) {
    throw new Error('useScoreContext must be used within a ScoreProvider');
  }
  return context;
};

export const ScoreProvider = ({ children }) => {
  // Initialize with a structured object instead of an array
  const [scoreData, setScoreData] = useState({
    scores: {},
    metadata: {
      totalScore: 0,
      maxPossibleScore: 52,
      lastUpdated: null,
      username: ''
    }
  });

  // Initialize username from localStorage
  useEffect(() => {
    try {
      const savedUsername = localStorage.getItem('cmasUsername');
      if (savedUsername) {
        setScoreData(prev => ({
          ...prev,
          metadata: {
            ...prev.metadata,
            username: savedUsername
          }
        }));
      }
    } catch (e) {
      console.error('Error loading username from localStorage:', e);
    }
  }, []);

  // Load scores from localStorage on initial render
  useEffect(() => {
    try {
      const savedScoreData = localStorage.getItem('cmasScoreData');
      if (savedScoreData) {
        const parsedScoreData = JSON.parse(savedScoreData);
        console.log('Loading score data from localStorage:', parsedScoreData);
        setScoreData(parsedScoreData);
      }
    } catch (e) {
      console.error('Error loading score data from localStorage:', e);
    }
  }, []);

  // Update localStorage whenever scores change
  useEffect(() => {
    try {
      localStorage.setItem('cmasScoreData', JSON.stringify(scoreData));
      console.log('Saved score data to localStorage:', scoreData);
    } catch (e) {
      console.error('Error saving score data to localStorage:', e);
    }
  }, [scoreData]);

  // Set a score for a specific task
  const setScoreForTask = (taskId, value, maxPoints) => {
    console.log(`Setting score for task ${taskId}: ${value} (max: ${maxPoints})`);
    
    // Ensure value is a number
    const numValue = Number(value);
    if (isNaN(numValue)) {
      console.error(`Invalid score value for task ${taskId}:`, value);
      return;
    }
    
    setScoreData(prevData => {
      // Calculate new total score
      const prevTotal = prevData.metadata.totalScore || 0;
      const prevScore = prevData.scores[`task${taskId}`]?.score || 0;
      const scoreDifference = numValue - prevScore;
      const newTotalScore = prevTotal + scoreDifference;
      
      return {
        scores: {
          ...prevData.scores,
          [`task${taskId}`]: {
            id: taskId,
            score: numValue,
            maxPoints: maxPoints || (prevData.scores[`task${taskId}`]?.maxPoints || 0),
            timestamp: new Date().toISOString()
          }
        },
        metadata: {
          ...prevData.metadata,
          totalScore: newTotalScore,
          lastUpdated: new Date().toISOString()
        }
      };
    });
  };

  // Clear all scores
  const clearScores = () => {
    console.log('Clearing all scores');
    setScoreData({
      scores: {},
      metadata: {
        ...scoreData.metadata,
        totalScore: 0,
        lastUpdated: new Date().toISOString()
      }
    });
    try {
      localStorage.removeItem('cmasScoreData');
    } catch (e) {
      console.error('Error removing score data from localStorage:', e);
    }
  };

  // Update username
  const updateUsername = (name) => {
    setScoreData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        username: name
      }
    }));
    try {
      localStorage.setItem('cmasUsername', name);
    } catch (e) {
      console.error('Error saving username to localStorage:', e);
    }
  };

  // Get scores as an array (for compatibility with existing code)
  const getScoresArray = () => {
    const maxTaskId = Object.keys(scoreData.scores).reduce((max, key) => {
      const id = parseInt(key.replace('task', ''));
      return id > max ? id : max;
    }, -1);
    
    const scoresArray = Array(maxTaskId + 1).fill(null);
    
    Object.values(scoreData.scores).forEach(taskScore => {
      scoresArray[taskScore.id] = taskScore.score;
    });
    
    return scoresArray;
  };

  // Calculate total score
  const calculateTotalScore = () => {
    return scoreData.metadata.totalScore || 
           Object.values(scoreData.scores).reduce((sum, task) => sum + (Number(task.score) || 0), 0);
  };

  // Export scores as CSV
  const exportScoresAsCsv = () => {
    if (Object.keys(scoreData.scores).length === 0) return null;
    
    // Create CSV header
    let csv = 'Username,TaskID,Score,MaxPoints,Timestamp\n';
    
    // Add each score as a row
    Object.values(scoreData.scores).forEach(taskScore => {
      csv += `${scoreData.metadata.username},${taskScore.id},${taskScore.score},${taskScore.maxPoints},${taskScore.timestamp}\n`;
    });
    
    // Create and return a blob
    return new Blob([csv], { type: 'text/csv' });
  };

  // The context value
  const value = {
    scoreData,
    setScoreForTask,
    clearScores,
    updateUsername,
    exportScoresAsCsv,
    calculateTotalScore,
    getScoresArray
  };

  return (
    <ScoreContext.Provider value={value}>
      {children}
    </ScoreContext.Provider>
  );
};

export default ScoreProvider;
