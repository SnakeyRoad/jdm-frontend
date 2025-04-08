import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import CmasTaskCard from './CmasTaskCard';

// This wrapper safely extracts the taskId parameter and passes the correct task
const TaskWrapper = ({ tasks, onComplete }) => {
  const { taskId } = useParams();
  
  // Convert taskId to number or default to 0
  const taskIndex = parseInt(taskId) || 0;
  
  // Check if task exists
  if (!tasks[taskIndex]) {
    return <Navigate to="/task/0" />;
  }
  
  return (
    <CmasTaskCard
      task={tasks[taskIndex]}
      totalTasks={tasks.length}
      onComplete={onComplete}
    />
  );
};

export default TaskWrapper;
