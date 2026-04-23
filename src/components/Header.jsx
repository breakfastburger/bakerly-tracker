import React from 'react';
import { Moon, Sun } from 'lucide-react';

const Header = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <header className={`shadow-sm border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex-1" />
        <img 
          src="/bakerly-tracker/images/logo.png" 
          alt="Bakerly Tracker" 
          className="h-12 w-auto"
        />
        <div className="flex-1 flex justify-end">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
