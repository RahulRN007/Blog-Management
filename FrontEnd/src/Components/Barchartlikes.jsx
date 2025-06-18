import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import API from "../config";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChartLikes = () => {
  const [labels, setLabels] = useState([]);        // trimmed titles
  const [fullTitles, setFullTitles] = useState([]); // full titles for tooltip
  const [authorNames, setAuthorNames] = useState([]);
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${API}/fetchblogdetails`);
        const blogs = response.data.data;

        // Sort by likes descending
        const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);

        // Take top 3 liked blogs
        const top3 = sortedBlogs.slice(0, 3);

        setLabels(
          top3.map(blog =>
            blog.title.length > 10 ? blog.title.substring(0, 10) + '...' : blog.title
          )
        );
        setFullTitles(top3.map(blog => blog.title));  // full titles for tooltip
        setAuthorNames(top3.map(blog => blog.user?.fullname || 'Unknown'));
        setLikes(top3.map(blog => blog.likes));
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);
 const backgroundColors = [
    'rgba(255, 99, 132, 0.6)',  // red-ish
    'rgba(54, 162, 235, 0.6)',  // blue
    'rgba(255, 206, 86, 0.6)',  // yellow
  ];

  const borderColors = [
    'rgb(255, 99, 132)',
    'rgb(54, 162, 235)',
    'rgb(255, 206, 86)',
  ];
  const data = {
    labels,
    datasets: [
      {
        label: 'Top 3 Most Liked Blogs',
        data: likes,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
    },
    plugins: {
      legend: {
        position: 'disable',
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            return `Title: ${fullTitles[index]}`;
          },
          label: (tooltipItem) => {
            const index = tooltipItem.dataIndex;
            return `Author: ${authorNames[index]} | Likes: ${tooltipItem.raw}`;
          },
        },
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChartLikes;
