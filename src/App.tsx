/**
 * Main App Component
 * 
 * Root component that:
 * - Provides Redux store
 * - Manages modal state
 * - Renders header and main content
 */

import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Header } from './components/Layout/Header';
import { TradeList } from './pages/TradeList';
import { TradeForm } from './components/TradeForm/TradeForm';
import { useAppDispatch } from './store/hooks';
import { loadMockData } from './store/tradeSlice';
import { mockTrades } from './utils/mockData';

const AppContent: React.FC = () => {
  const [showTradeForm, setShowTradeForm] = useState(false);
  const dispatch = useAppDispatch();

  const handleLoadMockData = () => {
    if (window.confirm('This will load demo data. Continue?')) {
      dispatch(loadMockData(mockTrades));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        onCreateTrade={() => setShowTradeForm(true)}
        onLoadMockData={handleLoadMockData}
      />
      <TradeList />
      {showTradeForm && (
        <TradeForm onClose={() => setShowTradeForm(false)} />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
