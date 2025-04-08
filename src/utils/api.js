// Simulated API functions that would connect to your backend

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
 * Fetches historical data for a doctor
 * @returns {Promise<Array>}
 */
export const fetchHistoricalData = async () => {
  // Simulated API call to get historical data
  return new Promise((resolve) => {
    setTimeout(() => {
      // Sample mock data
      const mockData = [
        { username: 'patient1', date: '2025-03-01', totalScore: 28 },
        { username: 'patient2', date: '2025-03-05', totalScore: 32 },
        { username: 'patient3', date: '2025-03-10', totalScore: 19 },
        { username: 'patient1', date: '2025-03-15', totalScore: 30 },
        { username: 'patient2', date: '2025-03-20', totalScore: 35 },
        { username: 'patient3', date: '2025-03-25', totalScore: 22 },
      ];
      resolve(mockData);
    }, 1000);
  });
};