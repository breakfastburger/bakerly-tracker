import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="px-4 py-3 flex items-center justify-center">
        <img 
          src="/bakerly-tracker/images/logo.png" 
          alt="Bakerly Tracker" 
          className="h-12 w-auto"
        />
      </div>
    </header>
  );
};

export default Header;
