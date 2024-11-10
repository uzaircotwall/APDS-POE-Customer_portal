import React, { useState } from 'react';



import api from '../api';

const TransferFunds = ({ balance, token, onTransactionUpdate }) => {
  const [selectedAccount, setSelectedAccount] = useState('Savings');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (amount <= 0 || amount > balance) {
      setMessage('Invalid amount');
      return;
    }

    try {
      await api.post('/api/payments/transfer', 
        { toAccount: selectedAccount, amount }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`Transferred to ${selectedAccount} successfully!`);
      setAmount('');
      onTransactionUpdate();
    } catch (error) {
      setMessage('Transfer failed');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Transfer to Your Accounts</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleTransfer}>
        <select 
          value={selectedAccount} 
          onChange={(e) => setSelectedAccount(e.target.value)} 
          className="input-field"
        >
          <option value="Savings">Savings</option>
          <option value="Loan">Loan</option>
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="input-field"
        />
        <button type="submit" className="btn-yellow">Transfer</button>
      </form>
    </div>
  );
};

export default TransferFunds;
