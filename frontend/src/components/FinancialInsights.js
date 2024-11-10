// src/components/FinancialInsights.js

import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const FinancialInsights = ({ transactions = [] }) => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    if (transactions.length === 0) {
      setChartData({
        labels: ['No data available'],
        datasets: [
          {
            label: 'No data',
            data: [1],
            backgroundColor: ['#d3d3d3'],
          },
        ],
      });
      return;
    }

    const moneyIn = transactions
      .filter((tx) => tx.transactionType === 'incoming')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const moneyOut = transactions
      .filter((tx) => tx.transactionType === 'outgoing')
      .reduce((sum, tx) => sum + tx.amount, 0);

    setChartData({
      labels: ['Money In', 'Money Out'],
      datasets: [
        {
          label: 'In vs Out',
          data: [moneyIn, moneyOut],
          backgroundColor: ['#4caf50', '#ff6384'], // Green for in, red for out
        },
      ],
    });
  }, [transactions]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg mt-6">
      <h2 className="text-xl font-semibold text-center mb-4 text-yellow-600">Financial Insights</h2>
      {transactions.length > 0 ? (
        <Pie data={chartData} options={options} />
      ) : (
        <p className="text-center text-gray-500">No transaction data available to display.</p>
      )}
    </div>
  );
};

export default FinancialInsights;
