/**
 * Creates and triggers download of a CSV file from scores data
 * @param {string} username - The username to include in the CSV
 * @param {Array<Object>} scores - Array of scores with taskId, taskName, and score
 * @returns {void}
 */
export const downloadScoresAsCsv = (username, scores) => {
  if (!scores || scores.length === 0) {
    console.error('No scores to export');
    return;
  }

  // Create CSV content
  let csvContent = 'Username,TaskID,TaskName,Score\n';
  
  scores.forEach((scoreItem) => {
    if (scoreItem.score !== null) {
      // Handle case where we get a simple array of scores
      if (typeof scoreItem === 'number') {
        csvContent += `${username},${scores.indexOf(scoreItem)},"Task ${scores.indexOf(scoreItem) + 1}",${scoreItem}\n`;
      } 
      // Handle case where we get structured data
      else {
        csvContent += `${username},${scoreItem.taskId},"${scoreItem.taskName || `Task ${scoreItem.taskId + 1}`}",${scoreItem.score}\n`;
      }
    }
  });

  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link and trigger download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${username}_cmas_scores.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Creates and triggers download of a CSV file for historical data
 * @param {Array<Object>} data - Array of historical data objects
 * @returns {void}
 */
export const downloadHistoricalDataAsCsv = (data) => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Get all unique keys from the data
  const allKeys = new Set();
  data.forEach(item => {
    Object.keys(item).forEach(key => {
      // Skip the scoreColor key as we'll handle it specially
      if (key !== 'scoreColor') {
        allKeys.add(key);
      }
    });
  });
  
  // Add our custom headers
  allKeys.add('scoreCategory');
  
  const headers = Array.from(allKeys);

  // Create CSV header row
  let csvContent = headers.join(',') + '\n';
  
  // Add data rows
  data.forEach(item => {
    const row = headers.map(header => {
      // For score category, translate the color to a descriptive text
      if (header === 'scoreCategory') {
        const colorMap = {
          '#ef4444': 'Severe impairment',
          '#f97316': 'Moderate impairment',
          '#facc15': 'Mild impairment',
          '#22c55e': 'Normal function',
          '#6b7280': 'Not categorized'
        };
        return colorMap[item.scoreColor] || item.interpretation || 'Unknown';
      }
      
      // Handle normal values
      const value = item[header] !== undefined ? item[header] : '';
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
    csvContent += row + '\n';
  });

  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link and trigger download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `cmas_historical_data.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};