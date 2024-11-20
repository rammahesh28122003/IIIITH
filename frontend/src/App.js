import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Function to decode Base64
const decodeBase64 = (base64String) => {
  try {
    const decoded = atob(base64String); // Decode Base64 string
    return JSON.parse(decoded); // Attempt to parse as JSON
  } catch (error) {
    console.error("Error decoding Base64:", error);
    return null; // If Base64 decoding fails, return null
  }
};

const App = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the logs from the API
    axios
      .get('http://localhost:3000/log')
      .then((response) => {
        // Parse the log entries and handle Base64 encoding or JSON objects
        const parsedLogs = response.data.logs.map((log) => {
          if (log.includes('BASE64:')) {
            const base64Data = log.split('BASE64:')[1].trim();
            const decodedLog = decodeBase64(base64Data);
            if (decodedLog) {
              return { timestamp: decodedLog.timestamp, user: decodedLog.user, event: decodedLog.event };
            } else {
              return { timestamp: 'Invalid Base64', user: 'N/A', event: 'Failed to decode Base64' };
            }
          }

          try {
            const logEntry = JSON.parse(log);
            return { timestamp: logEntry.timestamp, user: logEntry.user, event: logEntry.event };
          } catch (jsonError) {
            return { timestamp: 'Unknown', user: 'Unknown', event: log };
          }
        });

        setLogs(parsedLogs);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch logs');
        setLoading(false);
      });
  }, []);

  // Prepare data for visualization (e.g., event frequency over time)
  const eventCounts = logs.reduce((acc, log) => {
    const event = log.event || 'Unknown';
    acc[event] = (acc[event] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(eventCounts),
    datasets: [
      {
        label: 'Event Frequency',
        data: Object.values(eventCounts),
        borderColor: '#3498db',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  if (loading) {
    return <div className="loading-container">Loading the log data...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="log-container">
      <center><h1>Log Visualization</h1>
      <p>"Data tells a story, but it's the logs that reveal the plot..."</p>

      {/* Render Line Chart */}
      <div className="chart">
        <Line data={chartData} />
      </div></center>

      {/* Render Log Table */}
      <div className="table-container">
        <table className="log-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Event</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.timestamp}</td>
                <td>{log.user}</td>
                <td>{log.event}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
