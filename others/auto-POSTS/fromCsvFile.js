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
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRandomMillis() {
  return Math.floor(Math.random() * (1000 - 500 + 1) + 500);
}

async function processCsvBody(csvFilePath, columnsName, startRow, endRow) {
  const parser = fs.createReadStream(csvFilePath)
  .pipe(csv_parser({
      delimiter: ';',
      columns: columnsName, //['Timestamp','axisX','axisY','axisZ','battery','course','driverUniqueId','emergency','event','fuel','geofenceIds','hdop','horometerAlt','ignition','io24','io248','io483','io68','lastUpdate','latitude','longitude','motion','odometer','outdated','pdop','power','proximity','sat','speed','start','temp1','tripOdometer','valid'],
      from_line: startRow,
      to_line: endRow
    })
  );

  let previousTimestamp = null;
  let isFirstRow = true;

  for await (const telemetryRow of parser) {
    
    // // dynamic wait time between operation
    // const timestamp = isFirstRow ? Date.now() : Date.parse(telemetryRow['timestamp']);
    // const delayTime = isFirstRow ? 0 : timestamp - previousTimestamp + getRandomMillis();
    // previousTimestamp = timestamp;
    // isFirstRow = false;

    delayTime = 1000; // static waiting value... remove
    await delay(delayTime);

    await postTelemetry(telemetryRow);
  }
}


async function postTelemetry(telemetryData) {
  console.log(telemetryData);
  const url = `https://${process.env.TB_DNS}/api/v1/${process.env.CUN_TEST_TOKEN}/telemetry`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(telemetryData),
  });
  
  if (response.ok) { console.log('Telemetry posted successfully'); }
  else { console.log('Failed to post telemetry:', response.status); }
}



//-----------------------------------------------------------------
// main execution

const csvFilePath = process.env.CSV_FILE_PATH;
let startRow = 2530;
let endRow = 2550;


(async ()=>{
  let columnsName = await getColumnsName(csvFilePath)
  
  console.log(columnsName)
  
  processCsvBody(csvFilePath, columnsName, startRow, endRow).catch((err) => {
    console.error('Error processing CSV:', err);
  });
})();

