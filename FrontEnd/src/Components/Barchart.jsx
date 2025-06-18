import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = () => {
  // store labels, author names, and views separately for top and less viewed
  const [topLabels, setTopLabels] = useState([]);
  const [topAuthorNames, setTopAuthorNames] = useState([]);
  const [topViews, setTopViews] = useState([]);
  const [lessLabels, setLessLabels] = useState([]);
  const [lessAuthorNames, setLessAuthorNames] = useState([]);
  const [lessViews, setLessViews] = useState([]);

  const [showTop, setShowTop] = useState(true);

  useEffect(() => {
    const fetchBlogViews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/fetchblogdetails');
        const blogs = response.data.data;

        const sortedBlogs = blogs.sort((a, b) => b.views - a.views);

        const topBlogs = sortedBlogs.slice(0, 5);
        const lessViewedBlogs = sortedBlogs.slice(5,0);

        setTopLabels(
          topBlogs.map(blog =>
            blog.title.length > 15 ? blog.title.substring(0, 15) + '...' : blog.title
          )
        );
        setTopAuthorNames(topBlogs.map(blog => blog.user.fullname));
        setTopViews(topBlogs.map(blog => blog.views));

        setLessLabels(
          lessViewedBlogs.map(blog =>
            blog.title.length > 15 ? blog.title.substring(0, 15) + '...' : blog.title
          )
        );
        setLessAuthorNames(lessViewedBlogs.map(blog => blog.user.fullname));
        setLessViews(lessViewedBlogs.map(blog => blog.views));
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogViews();
  }, []);

  // Select data based on toggle
  const labels = showTop ? topLabels : lessLabels;
  const authorNames = showTop ? topAuthorNames : lessAuthorNames;
  const views = showTop ? topViews : lessViews;

  const chartData = {
    labels,
    datasets: [
      {
        label: showTop ? 'Top Viewed Blogs' : 'Less Viewed Blogs',
        data: views,
        backgroundColor: showTop ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 159, 64, 0.6)',
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'disable',
        onClick: (e, legendItem, legend) => {
          setShowTop(prev => !prev);
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            return `Author: ${authorNames[index] || 'Unknown'}`;
          },
          label: (tooltipItem) => `Views: ${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
