const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors'); // Fixed CORS import
const app = express();
const port = 3000;

// Log file path
const logFilePath = path.join(__dirname, 'logs', 'assignment_prod.log');

// Middleware to parse incoming JSON requests
app.use(express.json()); // Using built-in middleware for JSON parsing
app.use(cors()); // Fixed CORS usage

// Utility functions to decode Base64 and handle errors
const decodeBase64 = (base64String) => {
  try {
    return Buffer.from(base64String, 'base64').toString('utf-8'); // Using Buffer to decode base64
  } catch (error) {
    console.error('Error decoding Base64:', error);
    throw new Error('Invalid Base64 encoding');
  }
};

// Function to write new logs to the log file
const writeLog = (logData) => {
  fs.appendFile(logFilePath, `${JSON.stringify(logData)}\n`, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    } else {
      console.log('Log written to file successfully');
    }
  });
};

// Handle POST request for log entries
app.post('/log', (req, res) => {
  const logEntry = req.body;

  try {
    if (!logEntry || !logEntry.logData) {
      return res.status(400).json({ error: 'Missing logData field' });
    }

    // Process log data for Base64 decoding if necessary
    if (logEntry.logData.includes('BASE64:')) {
      const base64Data = logEntry.logData.split('BASE64:')[1].trim();
      const decodedData = decodeBase64(base64Data);

      // Attempt to parse the decoded data as JSON
      try {
        const jsonData = JSON.parse(decodedData);
        logEntry.decodedData = jsonData;
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
        return res.status(400).json({ error: 'Malformed JSON in Base64 data' });
      }
    }

    // Write the log entry to the file
    writeLog(logEntry);

    // Further processing can be done here (e.g., saving to a database)
    console.log('Processed Log Entry:', logEntry);
    res.status(200).json({ message: 'Log processed successfully', logEntry });

  } catch (error) {
    console.error('Error processing log entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Handle GET request to fetch logs
app.get('/log', (req, res) => {
  // Read the log file asynchronously
  fs.readFile(logFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading log file:', err);
      return res.status(500).json({ error: 'Failed to read log file' });
    }

    // Split the log file data into an array of log entries (by newlines)
    const logEntries = data.split('\n').filter(Boolean); // Filter out empty lines

    // Return the log entries as JSON
    res.status(200).json({ logs: logEntries });
  });
});

// Handle root route (optional for testing)
app.get('/', (req, res) => {
  res.send('Welcome to the Log API!');
});

// Start the server
app.listen(port, () => {
  console.log(`Log API is running at http://localhost:${port}`);
});
