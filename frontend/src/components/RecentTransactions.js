import React from 'react';

const RecentTransactions = ({ transactions }) => {
  return (
    <div className="p-5 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4">Recent Transactions</h3>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction._id} className="mb-2">
            <span className="font-semibold">
              {transaction.transactionType === 'incoming' ? 'Money In' : 'Money Out'}
            </span>
            : R{transaction.amount} - <span className="text-gray-600">{transaction.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentTransactions;
