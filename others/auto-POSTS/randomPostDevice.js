const log = console.log;


let {credentials, testDevices, jueputacalletano} = require('../../myvars')
let {buildMsg} = require('./auxRPD')

// Pause message Telemetry to the specified device ID
async function sendMessageToDevice(deviceId, message) {
  // set variables
  const url = `https://${credentials.dns}/api/v1/${deviceId}/telemetry`;
  const headers = {
    'Content-Type': 'application/json'
  };
  const body = JSON.stringify(message);
  // try the post
  try {
    const response = await fetch(url, { method: 'POST', headers, body });
    log(`Message sent to device ${deviceId}:`); // response
  } catch (error) {
    console.error(`Error sending message to device ${deviceId}:`, error);
  }
}

let start = performance.now()

function main(){
  // Loop over the device array to perform the data replacing and Postingg
  for(device of testDevices.slice(0,6)){
    log(device.name, device.token)
    // let msgBody = buildMsg(device);
    // log(msgBody)
  }
}
main()

log(performance.now() - start)