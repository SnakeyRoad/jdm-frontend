// Simulated API functions that would connect to your backend

// Simulated database for historical data
let historicalData = [
  { username: 'testkid', date: '2024-01-15', totalScore: 22, interpretation: 'Moderate impairment' },
  { username: 'testkid', date: '2024-02-01', totalScore: 28, interpretation: 'Moderate impairment' },
  { username: 'testkid', date: '2024-02-15', totalScore: 35, interpretation: 'Mild impairment' },
  { username: 'patient2', date: '2024-02-20', totalScore: 32, interpretation: 'Moderate impairment' },
  { username: 'patient3', date: '2024-02-25', totalScore: 19, interpretation: 'Severe impairment' },
  { username: 'testkid', date: '2024-03-01', totalScore: 38, interpretation: 'Mild impairment' },
  { username: 'patient2', date: '2024-03-05', totalScore: 35, interpretation: 'Mild impairment' },
  { username: 'patient3', date: '2024-03-10', totalScore: 22, interpretation: 'Moderate impairment' }
];

/**
 * Simulates authentication with backend
 * @param {string} username 
 * @param {string} password 
 * @param {string} role 
 * @returns {Promise<{success: boolean, user?: {username: string, role: string}, error?: string}>}
 */
export const authenticateUser = async (username, password, role) => {
  // For demonstration - in a real app this would be a fetch request to your backend
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple validation checking for demo users
      if (role === 'kid' && username === 'testkid' && password === 'pass') {
        resolve({ success: true, user: { username, role } });
      } else if (role === 'doctor' && username === 'drhouse' && password === 'pass') {
        resolve({ success: true, user: { username, role } });
      } else {
        resolve({ success: false, error: 'Invalid username, password, or role.' });
      }
    }, 600); // Simulate network delay
  });
};

/**
 * Submits scores to the backend
 * @param {string} username 
 * @param {Array<Object>} scores - Array of score objects with taskId and score properties
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const submitScores = async (username, scores) => {
  // Simulated API call to submit scores
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!username) {
        resolve({ success: false, error: 'Username is required.' });
        return;
      }

      if (!Array.isArray(scores) || scores.length === 0) {
        resolve({ success: false, error: 'No scores provided.' });
        return;
      }

      // Check for valid scores
      let hasValidScores = false;
      for (const scoreItem of scores) {
        // Handle both number and object formats
        const score = typeof scoreItem === 'number' ? scoreItem : scoreItem.score;
        if (score !== null && score !== undefined && !isNaN(score)) {
          hasValidScores = true;
          break;
        }
      }

      if (!hasValidScores) {
        resolve({ success: false, error: 'No valid scores found.' });
        return;
      }

      // In a real app, you would send a POST request to your backend
      console.log('Submitting scores:', { username, scores });
      resolve({ success: true });
    }, 800);
  });
};

/**
 * Saves a new score measurement
 */
export const saveScoreMeasurement = async (username, totalScore) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const today = new Date();
      const measurement = {
        username,
        date: today.toISOString().split('T')[0],
        totalScore,
        interpretation: getScoreInterpretation(totalScore)
      };
      
      historicalData.push(measurement);
      resolve({ success: true });
    }, 300);
  });
};

/**
 * Fetches historical data for the doctor dashboard
 */
export const fetchHistoricalData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(historicalData);
    }, 1000);
  });
};

// Helper function to get score interpretation
function getScoreInterpretation(score) {
  if (score >= 0 && score <= 19) return 'Severe impairment';
  if (score >= 20 && score <= 34) return 'Moderate impairment';
  if (score >= 35 && score <= 49) return 'Mild impairment';
  if (score >= 50) return 'Normal function';
  return 'Not categorized';
}