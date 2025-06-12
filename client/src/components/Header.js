import React from 'react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 shadow-lg">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">SEO Analyzer</h1>
          <p className="text-blue-100">Optimize your content with intelligent suggestions</p>
        </div>
        <div className="hidden md:block">
          <div className="flex space-x-2">
            <div className="h-3 w-3 rounded-full bg-blue-200"></div>
            <div className="h-3 w-3 rounded-full bg-blue-300"></div>
            <div className="h-3 w-3 rounded-full bg-blue-400"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;