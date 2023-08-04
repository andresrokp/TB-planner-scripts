// iterate over a csv file from a row to another row and send a post to TB's device
// timing delay to emulate real sending

require('dotenv').config()
const fs = require('fs');
const { parse: csv_parser} = require('csv');
var counter = 1;


//-----------------------------------------------------------------
// main execution

const csvFilePath = process.env.CSV_FILE_PATH;
let startRow = parseInt(process.argv[2]);
let endRow = parseInt(process.argv[3]);
// 2520 2540 
// 2525 2555
// 2 8000
// 8440 8540
// console.log(startRow, endRow);

(async ()=>{
  let columnsName = await getColumnsName(csvFilePath)
  // console.log(columnsName)
  processCsvBody(csvFilePath, columnsName, startRow, endRow).catch((err) => {
    console.error('Error processing CSV:', err);
  });
})();




//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Aux Functions


function getColumnsName(csvFilePath) {
  return new Promise((res,rej)=>{
    let stream = fs.createReadStream(csvFilePath, {encoding:'utf8'});
    let columnsName;

    stream.on('data', (chunk)=>{
      // toma la primera línea del primera chunk y la divide por ';'
      columnsName = chunk.split(/\r\n|\n/)[0].split(';');
      // cierra para que sólo se ejecute una vez
      stream.close();
    })
    stream.on('close',()=>{
      return res(columnsName);
    })
  })
}

// utilidad para implementar una espera entre envíos
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

  for await (const telemetryRow of parser) {
    delayTime = 1000; // static waiting value...
    await delay(delayTime);
    //TODO: build telemetry considering a forced timestamp from csv. Triggers if i put a flag in CLI
    console.log(counter,'telemetryRow',startRow+counter++-1,telemetryRow)
    await postTelemetry(telemetryRow);
  }
}


async function postTelemetry(telemetryData) {
  const url = `https://${process.env.TB_DNS}/api/v1/${process.env.CUN_TEST_TOKEN}/telemetry`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(telemetryData),
  });
  
  if (response.ok) { console.log('Telemetry posted successfully'); }
  else { console.log('Failed to post telemetry:', response.status); }
}