// iterate over a csv file from a row to another row and send a post to TB's device
// timing delay to emulate real sending

require('dotenv').config()
const fs = require('fs');
const { parse: csv_parser} = require('csv');

async function sendTelemetryData(csvFilePath, deviceToken, startRow, endRow) {
  let headersRow = [];
  let rowCount = 0;

  // Read the CSV file, extract, buil msg and send teltry
  fs.createReadStream(csvFilePath)
    .pipe(csv_parser({delimiter:';'}))
    .on('data', (data) => {      // data es un arreglo simple de length = elAnchoDeLaTabla
      // headers name capture
      if (rowCount == 0) headersRow = [...data]
      rowCount++;
      // attend only the row interval
      if (rowCount >= startRow && rowCount <= endRow) {
        console.log(data)
        // Construct the telemetry message object
        let msg = {}
        headersRow.forEach((e,i) => msg[e] = data[i]);
        console.log(msg)
        console.log("-------")

      }
    })
    // .on('end', async () => {
    //   // Send telemetry data to ThingsBoard API with time delay between messages
    //   for (const [index, message] of telemetryData.entries()) {
    //     const delay = index === 0 ? 0 : (new Date(message.timestamp) - new Date(telemetryData[index - 1].timestamp));
    //     await delayExecution(delay);
    //     await sendMessageToDevice(deviceToken, message);
    //   }
    // })
    // .on('error', (error) => {
    //   console.error('Error reading CSV file:', error);
    // });
}

// async function delayExecution(delay) {
//   return new Promise((resolve) => setTimeout(resolve, delay));
// }


// async function sendMessageToDevice(deviceToken, message) {
//   // Set variables
//   const url = `https://${credentials.dns}/api/v1/${deviceToken}/telemetry`;
//   const headers = {
//     'Content-Type': 'application/json'
//   };
//   const body = JSON.stringify(message);

//   // Try the POST
//   try {
//     const response = await fetch(url, { method: 'POST', headers, body });
//     console.log(`Message sent to device ${message.device.uniqueId} - ${message.device.name}`); // Response
//   } catch (error) {
//     console.error(`Error sending message to device ${deviceToken}:`, error);
//   }
// }


// execution init
const csvFilePath = process.env.CSV_FILE_PATH;
const deviceToken = process.env.CUN_TEST_TOKEN;
const startRow = 3;
const endRow = 5;

sendTelemetryData(csvFilePath, deviceToken, startRow, endRow)
  .then(() => {
    console.log('Telemetry data sent successfully.');
  })
  .catch((error) => {
    console.error('Error sending telemetry data:', error);
  });

