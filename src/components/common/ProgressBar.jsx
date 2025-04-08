import React from 'react';

const ProgressBar = ({ current, total, label = true }) => {
  // Calculate percentage
  const percentage = Math.floor((current / total) * 100);
  
  return (
    <div className="w-full mb-4">
      <div className="flex justify-between mb-1">
        {label && (
          <>
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">{percentage}%</span>
          </>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div 
          className="bg-blue-500 h-4 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
