// iterate over a csv file from a row to another row and send a post to TB's device
// timing delay to emulate real sending

const fs = require('fs');
const csv = require('csv-parser');
const fetch = require('node-fetch');

async function sendTelemetryData(csvFilePath, deviceId, startRow, endRow) {
  const telemetryData = [];
  let rowCount = 0;

  // Read the CSV file and extract telemetry data
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => {
      rowCount++;
      if (rowCount >= startRow && rowCount <= endRow) {
        // Construct the telemetry message object
        const message = {
          device: { uniqueId: deviceId, name: 'Your Device Name' },
          // Set key-value pairs from CSV columns
          ...data
        };
        telemetryData.push(message);
      }
    })
    .on('end', async () => {
      // Send telemetry data to ThingsBoard API with time delay between messages
      for (const [index, message] of telemetryData.entries()) {
        const delay = index === 0 ? 0 : (new Date(message.timestamp) - new Date(telemetryData[index - 1].timestamp));
        await delayExecution(delay);
        await sendMessageToDevice(deviceId, message);
      }
    })
    .on('error', (error) => {
      console.error('Error reading CSV file:', error);
    });
}

async function delayExecution(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

// Example usage
const csvFilePath = 'path/to/your/csv/file.csv';
const deviceId = 'your-device-id';
const startRow = 2; // Start iterating from row 2 (excluding header)
const endRow = 10; // Iterate until row 10

sendTelemetryData(csvFilePath, deviceId, startRow, endRow)
  .then(() => {
    console.log('Telemetry data sent successfully.');
  })
  .catch((error) => {
    console.error('Error sending telemetry data:', error);
  });

async function sendMessageToDevice(deviceId, message) {
  // Set variables
  const url = `https://${credentials.dns}/api/v1/${deviceId}/telemetry`;
  const headers = {
    'Content-Type': 'application/json'
  };
  const body = JSON.stringify(message);

  // Try the POST
  try {
    const response = await fetch(url, { method: 'POST', headers, body });
    console.log(`Message sent to device ${message.device.uniqueId} - ${message.device.name}`); // Response
  } catch (error) {
    console.error(`Error sending message to device ${deviceId}:`, error);
  }
}
