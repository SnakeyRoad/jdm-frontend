/**
 * Saves CMAS scores to a CSV file
 * @param {number} totalScore - The total CMAS score
 * @returns {Promise<void>}
 */
export const saveToCsv = async (totalScore) => {
  try {
    // Get current date in DD:MM:YYYY format
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const dateStr = `${dd}:${mm}:${yyyy}`;

    // Determine category based on total score
    let category = '';
    if (totalScore >= 4 && totalScore <= 9) {
      category = 'CMAS Score 4-9';
    } else if (totalScore > 10) {
      category = 'CMAS Score > 10';
    }

    // Create CSV content
    const csvContent = `${dateStr},${category},${totalScore}\n`;

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'CMAS.csv';
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Error saving to CSV:', err);
    throw err;
  }
}; 