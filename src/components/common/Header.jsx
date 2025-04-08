import React from 'react';

const Header = ({ username, onLogout }) => {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-blue-400 text-white p-6 shadow-md w-full">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">JDM CMAS Exercise Tracker</h1>
          <p className="text-sm md:text-base mt-1 opacity-90">A simple tool for kids to report their CMAS scores.</p>
        </div>
        
        {username && (
          <div className="flex items-center">
            <span className="hidden md:inline mr-4 text-sm">
              Logged in as: <strong>{username}</strong>
            </span>
            <button 
              onClick={onLogout}
              className="bg-white text-blue-600 px-3 py-1 rounded-md hover:bg-blue-50 focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors text-sm"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
