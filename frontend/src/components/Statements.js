import React, { useEffect, useState } from 'react';
import { getPaymentHistory, getUserProfile } from '../api';
import FinancialInsights from './FinancialInsights';

const Statements = () => {
  const [transactions, setTransactions] = useState([]);
  const [userId, setUserId] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserId = async () => {
      if (token) {
        try {
          const profileResponse = await getUserProfile(token);
          setUserId(profileResponse.data._id);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      }
    };
    fetchUserId();
  }, [token]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (token) {
        try {
          const response = await getPaymentHistory(token);
          setTransactions(response.data);
        } catch (error) {
          console.error('Failed to fetch transactions:', error);
        }
      }
    };
    fetchTransactions();
  }, [token]);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md">
      <h3 className="text-3xl font-bold text-blue-700 mb-6">Statements</h3>
      
      <ul className="space-y-4">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <li key={transaction._id} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
              <span className="text-blue-700 font-semibold">
                {new Date(transaction.createdAt).toLocaleDateString()} - {transaction.displayText}
              </span>
              <span className={`font-medium ${transaction.transactionType === 'incoming' ? 'text-green-600' : 'text-red-600'}`}>
                R{transaction.amount}
              </span>
              <span className={`text-sm rounded-lg px-2 py-1 ${transaction.status === 'Approved' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1).toLowerCase()}
              </span>
            </li>
          ))
        ) : (
          <p className="text-blue-600">No transactions available.</p>
        )}
      </ul>

      <div className="mt-8">
        <FinancialInsights transactions={transactions} />
      </div>
    </div>
  );
};

export default Statements;
