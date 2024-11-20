Log Visualization Project::

This project is designed to visualize logs retrieved from an API. The logs are parsed, decoded if necessary, and presented both as a line chart (showing event frequency) and in a table format.

Table of Contents:
Installation Instructions/Setup
How to Run
Screenshots
Assumptions
Installation Instructions/Setup
Clone the repository:


git clone (https://github.com/rammahesh28122003/IIIT-H-IOT-LOG-PROJECT)
Navigate to the project directory:

cd log-visualization
Install dependencies:

You need Node.js and npm installed on your system. If they are not installed, download and install them.

Run the following command to install the required dependencies:

npm install
Start the development server:

npm start
This will start the React app locally. Open http://localhost:3000 in your browser to view the app.

How to Run
Fetch logs from the API:

The app fetches logs from the following endpoint:

http://localhost:3000/log
Ensure that your server is running and returning log data in the expected format (JSON).

Log Processing:

The logs may be in Base64 format, and the app will decode them if necessary.
If the logs are in JSON format, the app parses them directly and visualizes event frequencies.
Visualization:

The app will display a Line Chart showing the frequency of each event.
A Table will display the log details, including the timestamp, user, and event.
Interact with the table and chart:

The chart shows how often each event occurred over time.
The table provides detailed log information, with the ability to hover over rows to highlight them.
Screenshots:
Line Chart Visualization-https://drive.google.com/file/d/1tcM9_O45JR6qUIJPDi_BbxZ4E2WsZFjN/view?usp=sharing

Log Table-https://drive.google.com/file/d/1F7SgFXycldon1bqrIXf7SE4-SilNm3xE/view?usp=sharing

Assumptions
Log format:

Logs are provided either as Base64-encoded strings or as JSON objects.
The format of each log includes the timestamp, user, and event fields.
API Response:

The API should return logs in a JSON format with an array of logs under the logs key.
No authentication:

The app assumes that there is no authentication required to fetch logs from the API endpoint.
Error handling:

If decoding Base64 or parsing JSON fails, the app will display default error messages for those logs.
Thankyou...
