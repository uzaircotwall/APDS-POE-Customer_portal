import React, { useEffect, useState } from 'react';
import { getPaymentHistory } from '../api';
import FinancialInsights from './FinancialInsights'; // Import the FinancialInsights component

const Statements = () => {
  const [transactions, setTransactions] = useState([]);
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  useEffect(() => {
    const fetchTransactions = async () => {
      if (token) {
        try {
          const response = await getPaymentHistory(token);
          console.log("Fetched transactions:", response.data);
          setTransactions(response.data);
        } catch (error) {
          console.error('Failed to fetch transactions:', error);
        }
      } else {
        console.error('Token is missing');
      }
    };
    fetchTransactions();
  }, [token]);

  return (
    <div className="p-5 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4">Statements</h3>
      <ul>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <li key={transaction._id}>
              {new Date(transaction.createdAt).toLocaleDateString()} - {transaction.transactionType === 'incoming' ? 'Money In' : 'Money Out'}: R{transaction.amount} - {transaction.status}
            </li>
          ))
        ) : (
          <p>No transactions available.</p>
        )}
      </ul>
      
      {/* Display Financial Insights chart below Statements */}
      <div className="mt-8">
        <FinancialInsights transactions={transactions} />
      </div>
    </div>
  );
};

export default Statements;
