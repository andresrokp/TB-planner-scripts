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

function mainALoCerdo(qty){
  // Loop over the device array to perform the data replacing and Postingg
  for(device of testDevices.slice(0,qty)){
    // log(device.name, device.token)
    let msgBody = buildMsg(device);
    // log(msgBody)
    sendMessageToDevice(jueputacalletano,msgBody);
  }
}

function mainByStep(qty, t){
  log('post with delays')
  let i = 0
  const timer = setInterval(() => {
    let device = testDevices[i]
    log(i,device)
    let msgBody = buildMsg(device);
    // sendMessageToDevice(jueputacalletano,msgBody);
    if(i == qty || i == testDevices.length){
      clearInterval(timer);
    }
    i++
  }, t);
}

// to launch load test
// Array(1).fill().forEach(()=>mainALoCerdo()) //

// to send some with delays
mainByStep(6,1000)

log(performance.now() - start)