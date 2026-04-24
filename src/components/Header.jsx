import React from 'react';
import { Moon, Sun } from 'lucide-react';

const Header = ({ isDarkMode }) => {
  return (
    <header 
      className="fixed top-0 left-0 right-0 shadow-sm border-b z-40"
      style={{ 
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
        paddingTop: 'env(safe-area-inset-top)'
      }}
    >
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex-1" />
        <img 
          src="/bakerly-tracker/images/logo.png" 
          alt="Bakerly Tracker" 
          className="h-12 w-auto"
        />
        <div className="flex-1 flex justify-end">
        </div>
      </div>
    </header>
  );
};

export default Header;
