import React from 'react';
import { Link } from 'react-router-dom';
import { useScoreContext } from '../../contexts/ScoreContext';
import './KidWelcome.css';

const KidWelcome = ({ username }) => {
  const { updateUsername } = useScoreContext();
  
  // Update the username in context when component mounts
  React.useEffect(() => {
    if (username) {
      updateUsername(username);
    }
  }, [username, updateUsername]);

  return (
    <div className="welcome-container bg-blue-100 p-8 rounded-lg shadow-lg text-center max-w-2xl w-full mx-auto">
      <h2 className="text-3xl md:text-4xl font-comic text-blue-800 mb-6">
        Welcome, {username || 'Friend'}!
      </h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <p className="text-lg mb-4">
          Let's track your exercises and see how strong you're getting!
        </p>
        
        <div className="mb-6">
          <h3 className="text-xl font-bold text-blue-600 mb-2">What are CMAS Exercises?</h3>
          <p className="text-gray-700">
            CMAS exercises help your doctor understand how your muscles are doing. 
            These simple tasks show how strong you are getting over time!
          </p>
        </div>
        
        <div className="mb-4 flex justify-center">
          <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full">
            <span role="img" aria-label="star" className="text-3xl">⭐</span>
          </div>
          <div className="mx-4 flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
            <span role="img" aria-label="muscle" className="text-3xl">💪</span>
          </div>
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
            <span role="img" aria-label="trophy" className="text-3xl">🏆</span>
          </div>
        </div>
      </div>
      
      <Link 
        to="/task/0"
        className="start-button bg-green-500 hover:bg-green-600 text-white text-xl font-comic py-4 px-8 rounded-lg shadow-md transition-transform transform hover:scale-105 inline-block"
      >
        Let's Start! 🚀
      </Link>
    </div>
  );
};

export default KidWelcome;
