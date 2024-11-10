import React, { useEffect, useState, useCallback } from 'react';
import { LayoutGrid, Send, Clock, PieChart, FileText, DollarSign } from 'lucide-react';
import PaymentForm from './PaymentForm';
import TransferFunds from './TransferFunds';
import RecentTransactions from './RecentTransactions';
import FinancialInsights from './FinancialInsights';
import Statements from './Statements';
import { getBalanceAndTransactions } from '../api';

const UserHome = ({ token }) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserBalanceAndTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBalanceAndTransactions(token);
      setBalance(response.data.balance);
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Failed to fetch balance and transactions:', error);
      setError('Could not load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUserBalanceAndTransactions();
  }, [fetchUserBalanceAndTransactions]);

  const tabs = [
    { id: 'makePayment', label: 'Make a Payment', icon: <DollarSign size={20} /> },
    { id: 'transferFunds', label: 'Transfer Funds', icon: <Send size={20} /> },
    { id: 'recentTransactions', label: 'Recent Transactions', icon: <Clock size={20} /> },
    { id: 'financialInsights', label: 'Financial Insights', icon: <PieChart size={20} /> },
    { id: 'statements', label: 'View Statements', icon: <FileText size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-8">
            <h2 className="text-4xl font-bold text-white text-center mb-6">
              Welcome to Your Dashboard
            </h2>
          </div>

          {/* Consistent Balance Display */}
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg max-w-md mx-auto -mt-8 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-lg">Current Balance</p>
                <p className="text-3xl font-bold text-yellow-600">
                  R{balance.toFixed(2)}
                </p>
              </div>
              <LayoutGrid className="text-yellow-600 w-12 h-12" />
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 p-4 bg-gray-50 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedTab === tab.id
                    ? 'bg-yellow-500 text-white shadow-md transform scale-105'
                    : 'bg-white text-gray-600 hover:bg-yellow-50 border border-gray-200'
                }`}
                aria-label={tab.label}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Section */}
          <div className="p-6">
            {loading ? (
              <p className="text-center text-gray-500">Loading data...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <>
                {selectedTab === 'makePayment' && (
                  <PaymentForm token={token} onTransactionUpdate={fetchUserBalanceAndTransactions} />
                )}
                {selectedTab === 'transferFunds' && (
                  <TransferFunds
                    balance={balance}
                    token={token}
                    onTransactionUpdate={fetchUserBalanceAndTransactions}
                  />
                )}
                {selectedTab === 'recentTransactions' && (
                  <RecentTransactions transactions={transactions} />
                )}
                {selectedTab === 'financialInsights' && (
                  <FinancialInsights transactions={transactions} />
                )}
                {selectedTab === 'statements' && (
                  <Statements transactions={transactions} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
