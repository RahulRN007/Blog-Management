import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const LineChart = () => {
  const [monthlyViews, setMonthlyViews] = useState(Array(12).fill(0)); // Jan to Dec

  useEffect(() => {
    const fetchMonthlyViews = async () => {
      try {
        const res = await axios.get("http://localhost:5000/monthlyviews");
        const data = Array(12).fill(0); // index 0 = Jan, 11 = Dec

        res.data.forEach(item => {
          const monthIndex = item._id - 1; // MongoDB months are 1-based
          data[monthIndex] = item.totalViews;
        });

        setMonthlyViews(data);
      } catch (error) {
        console.error("Error fetching monthly views", error);
      }
    };

    fetchMonthlyViews();
  }, []);

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Total Views 2025',
        data: monthlyViews,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '160px' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
