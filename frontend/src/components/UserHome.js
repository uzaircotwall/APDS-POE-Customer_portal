import React, { useEffect, useState, useCallback } from 'react';
import { LayoutGrid, DollarSign, FileText } from 'lucide-react';
import PaymentForm from './PaymentForm';
import Statements from './Statements';
import { getBalanceAndTransactions, getUserProfile } from '../api'; // Import user profile API

const UserHome = ({ token }) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [accountNumber, setAccountNumber] = useState(''); // State for account number
  const [selectedTab, setSelectedTab] = useState('makePayment');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data including balance and account number
  const fetchUserBalanceAndTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const balanceResponse = await getBalanceAndTransactions(token);
      setBalance(balanceResponse.data.balance);
      setTransactions(balanceResponse.data.transactions);

      const profileResponse = await getUserProfile(token); // Fetch user profile
      setAccountNumber(profileResponse.data.accountNumber); // Set the account number
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
    { id: 'makePayment', label: 'Make a Payment', icon: <DollarSign size={20} color="#ADD8E6" /> },
    { id: 'statements', label: 'View Statements', icon: <FileText size={20} color="#4169E1" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex flex-col items-center p-6 animate-fade-in">
      <div className="max-w-6xl w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6 animate-slide-down">
              Welcome to Your Dashboard
            </h2>
          </div>

          {/* Balance and Account Display */}
          <div className="p-6 bg-blue-50 rounded-xl shadow-lg max-w-md mx-auto -mt-8 mb-6 text-center animate-bounce-slow">
            <p className="text-gray-600 text-lg">Account Number</p>
            <p className="text-xl font-semibold text-blue-700 mb-4">{accountNumber}</p>
            <p className="text-gray-600 text-lg">Current Balance</p>
            <p className="text-3xl font-bold text-blue-600">R{balance.toFixed(2)}</p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-4 justify-center p-4 bg-gray-100 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 transform ${
                  selectedTab === tab.id
                    ? 'bg-blue-500 text-white shadow-md scale-105'
                    : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'
                }`}
                aria-label={tab.label}
              >
                {tab.icon}
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content Section */}
          <div className="p-6 animate-fade-in">
            {loading ? (
              <p className="text-center text-gray-500">Loading data...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <div>
                {selectedTab === 'makePayment' && (
                  <PaymentForm token={token} onTransactionUpdate={fetchUserBalanceAndTransactions} balance={balance} />
                )}
                {selectedTab === 'statements' && (
                  <Statements transactions={transactions} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-down {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-fade-in { animation: fade-in 1s ease-in-out forwards; }
        .animate-slide-down { animation: slide-down 0.6s ease forwards; }
        .animate-bounce-slow { animation: bounce-slow 2s infinite; }
      `}</style>
    </div>
  );
};

export default UserHome;
