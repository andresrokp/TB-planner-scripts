// iterate over a csv file from a row to another row and send a post to TB's device
// timing delay to emulate real sending

require('dotenv').config()
const fs = require('fs');
const { parse: csv_parser} = require('csv');


function getColumnsName(csvFilePath) {
  return new Promise((res,rej)=>{
    let stream = fs.createReadStream(csvFilePath, {encoding:'utf8'});
    let columnsName;
    stream.on('data', (chunk)=>{
        columnsName = chunk.split(/\r\n|\n/)[0].split(';');
        stream.close();
    })
    stream.on('close',()=>{
      return res(columnsName);
    })
  })
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, 2000));
}

function getRandomMillis() {
  return Math.floor(Math.random() * (1000 - 500 + 1) + 500);
}

async function processCsvBody(csvFilePath, columnsName) {
  const parser = fs.createReadStream(csvFilePath)
  .pipe(csv_parser({
      delimiter: ';',
      columns: columnsName,//['Timestamp','axisX','axisY','axisZ','battery','course','driverUniqueId','emergency','event','fuel','geofenceIds','hdop','horometerAlt','ignition','io24','io248','io483','io68','lastUpdate','latitude','longitude','motion','odometer','outdated','pdop','power','proximity','sat','speed','start','temp1','tripOdometer','valid'],
      from_line: 6,
      to_line: 10
    })
  );

  //   console.log(parser);

  let previousTimestamp = null;
  let isFirstRow = true;

  for await (const telemetryRow of parser) {
    const timestamp = isFirstRow ? Date.now() : Date.parse(telemetryRow['timestamp']);
    const delayTime = isFirstRow ? 0 : timestamp - previousTimestamp + getRandomMillis();
    previousTimestamp = timestamp;
    isFirstRow = false;

    await delay(delayTime);

    const deviceId = telemetryRow['device_id'];
    delete telemetryRow['timestamp'];
    delete telemetryRow['device_id'];

    const telemetryData = {
      [timestamp]: telemetryRow,
    };

    await postTelemetry(deviceId, telemetryData);
  }
}


async function postTelemetry(deviceId, telemetryData) {
    console.log(telemetryData);
//   const url = `https://${credentials.dns}/api/v1/${deviceId}/telemetry`;
//   const response = await fetch(url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(telemetryData),
//   });
  
//   if (response.ok) {
//     console.log('Telemetry posted successfully');
//   } else {
//     console.log('Failed to post telemetry:', response.status);
//   }
}


//-----------------------------------------------------------------
// main execution

const csvFilePath = process.env.CSV_FILE_PATH;
const credentials = {
  dns: 'your-thingsboard-dns',
};


(async ()=>{
  let columnsName = await getColumnsName(csvFilePath)
  
  console.log(columnsName)
  
  processCsvBody(csvFilePath, columnsName).catch((err) => {
    console.error('Error processing CSV:', err);
  });
})();


// sendTelemetryData(csvFilePath, deviceToken, startRow, endRow)
//   .then(() => {
//     console.log('Telemetry data sent successfully.');
//   })
//   .catch((error) => {
//     console.error('Error sending telemetry data:', error);
//   });

