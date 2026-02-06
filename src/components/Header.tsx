/**
 * Header Component
 *
 * Application header with title and primary actions.
 */

import React from 'react';

interface HeaderProps {
  onCreateTrade: () => void;
  onLoadMockData: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCreateTrade, onLoadMockData }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Trade Journal</h1>
            <p className="text-blue-100 text-sm mt-1">
              Track and manage your trading positions
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onLoadMockData}
              className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Load Demo Data
            </button>
            <button
              onClick={onCreateTrade}
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-medium transition-colors shadow-md"
            >
              + New Trade
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
