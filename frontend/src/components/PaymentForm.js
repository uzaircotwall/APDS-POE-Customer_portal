import React, { useState } from 'react';
import api from '../api';

const PaymentForm = ({ token, onTransactionUpdate }) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [message, setMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  const exchangeRates = {
    USD: 18.0,
    EUR: 20.0,
    GBP: 23.0,
    ZAR: 1,
  };

  const convertToZAR = (currency, amount) => {
    const rate = exchangeRates[currency];
    return rate ? (amount * rate).toFixed(2) : null;
  };

  const handlePreview = (e) => {
    e.preventDefault();
    setMessage('');
    const amountInZAR = currency !== 'ZAR' ? convertToZAR(currency, amount) : amount;
    setConvertedAmount(amountInZAR);
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setShowConfirmation(false);
    setShowFinalMessage(true);

    try {
      await api.post(
        '/api/payments',
        {
          recipientEmail,
          swiftCode,
          amount: convertedAmount,
          currency,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Payment request sent to admin for approval.');
      setRecipientEmail('');
      setSwiftCode('');
      setAmount('');
      setCurrency('USD');
      setConvertedAmount(null);
      onTransactionUpdate();

      // Hide the final message after 5 seconds (5000ms)
      setTimeout(() => setShowFinalMessage(false), 10000);
    } catch (error) {
      setMessage('Failed to create payment');
      setShowFinalMessage(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold text-yellow-700 mb-6">Send Funds</h2>

      {message && (
        <p className="mb-4 text-sm font-semibold text-green-600 bg-green-100 p-2 rounded-lg">
          {message}
        </p>
      )}

      {showFinalMessage ? (
        <p className="mb-4 text-sm font-semibold text-green-600 bg-green-100 p-2 rounded-lg">
          Payment request has been sent to admin for approval.
        </p>
      ) : showConfirmation ? (
        <div className="p-4 bg-gray-50 rounded-lg shadow-lg text-center">
          <p className="text-gray-700 mb-4">
            You are trying to send <strong>R{convertedAmount}</strong> to <strong>{recipientEmail}</strong>.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleConfirm}
              className="bg-green-500 text-white py-2 px-4 rounded-lg shadow hover:bg-green-600 transition-all duration-200"
            >
              Confirm
            </button>
            <button
              onClick={() => setShowConfirmation(false)}
              className="bg-red-500 text-white py-2 px-4 rounded-lg shadow hover:bg-red-600 transition-all duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handlePreview} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="recipientEmail" className="block text-left font-semibold text-gray-700">
              Recipient Email
            </label>
            <input
              type="email"
              id="recipientEmail"
              placeholder="Enter recipient's email address"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="swiftCode" className="block text-left font-semibold text-gray-700">
              SWIFT Code
            </label>
            <input
              type="text"
              id="swiftCode"
              placeholder="Enter SWIFT code"
              value={swiftCode}
              onChange={(e) => setSwiftCode(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="amount" className="block text-left font-semibold text-gray-700">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="currency" className="block text-left font-semibold text-gray-700">
              Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="ZAR">ZAR - South African Rand</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-lg shadow-lg hover:from-yellow-600 hover:to-yellow-700 transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
          >
            Preview Payment
          </button>
        </form>
      )}
    </div>
  );
};

export default PaymentForm;
