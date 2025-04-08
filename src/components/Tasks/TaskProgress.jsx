import React from 'react';

const TaskProgress = ({ currentTask, totalTasks }) => {
  // Calculate percentage
  const percentage = Math.floor((currentTask / totalTasks) * 100);
  
  // Generate step indicators
  const steps = Array.from({ length: totalTasks }, (_, index) => {
    const isActive = index < currentTask;
    const isCurrent = index === currentTask;
    
    return (
      <div 
        key={index}
        className={`step-indicator relative flex-1 h-2 ${
          isActive ? 'bg-blue-500' : isCurrent ? 'bg-blue-300' : 'bg-gray-200'
        }`}
      >
        <div 
          className={`absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full ${
            isActive ? 'bg-blue-500 text-white' : isCurrent ? 'bg-white border-2 border-blue-500 text-blue-500' : 'bg-white border border-gray-300 text-gray-500'
          } flex items-center justify-center text-sm font-medium`}
        >
          {index + 1}
        </div>
      </div>
    );
  });
  
  return (
    <div className="task-progress mb-8">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Progress</span>
        <span className="text-sm font-medium text-gray-700">{percentage}%</span>
      </div>
      
      <div className="steps-container flex items-center">
        {steps}
      </div>
      
      <div className="text-center mt-8 text-gray-600 text-sm">
        Task {currentTask + 1} of {totalTasks}
      </div>
    </div>
  );
};

export default TaskProgress;
