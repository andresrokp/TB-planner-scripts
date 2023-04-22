const log = console.log;

// LLM chatGPT: I want the posibility to modify randomly any of the key values in the propper data type an range with coherent min and max. Insert the random function in the same line of the JSON key name with propper values inside the function like this example
// >> example begin:
// {
//     "position": {
//         "id": a random funtion for whole number,
//         "attributes": {
//             "priority": a random whole number up to 5,
//             "sat": 8,
//             "event": a random whole up to 999,

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomBoolean() {
  return Math.random() >= 0.5;
}

function getRandomString(length) {
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function getRandomToken(length) {
  let result = "";
  const characters = "0123456789abcdef";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function getRandomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toISOString();
}

/* This are the 4 points of interception of 4 lines that enclose an area

[points]

The lines enclose an area.

Please elaborate a javascript function that return a (x,y) point values inside within the area enclosed by the 4 lines
*/


function getRandomPointInsideArea(point1, point2, point3, point4) {
  // Calculate the minimum and maximum x and y values of the bounding box
  // x is loggitude and y is latitude
  const minX = Math.min(point1[0], point2[0], point3[0], point4[0]);
  const maxX = Math.max(point1[0], point2[0], point3[0], point4[0]);
  const minY = Math.min(point1[1], point2[1], point3[1], point4[1]);
  const maxY = Math.max(point1[1], point2[1], point3[1], point4[1]);

  // Generate a random point inside the bounding box
  let x, y;
  do {
    x = Math.random() * (maxX - minX) + minX;
    y = Math.random() * (maxY - minY) + minY;
  } while (!isPointInsideArea([x, y], point1, point2, point3, point4));

  return [x, y];
}

function isPointInsideArea(point, point1, point2, point3, point4) {
  // Use the ray casting algorithm to determine if the point is inside the area
  const intersectCount = countIntersections(point, point1, point2, point3, point4);
  return intersectCount % 2 !== 0;
}

function countIntersections(point, point1, point2, point3, point4) {
  // Calculate the slope and y-intercept of each line segment
  const slope1 = getSlope(point1, point2);
  const yIntercept1 = getYIntercept(point1, slope1);
  const slope2 = getSlope(point2, point3);
  const yIntercept2 = getYIntercept(point2, slope2);
  const slope3 = getSlope(point3, point4);
  const yIntercept3 = getYIntercept(point3, slope3);
  const slope4 = getSlope(point4, point1);
  const yIntercept4 = getYIntercept(point4, slope4);

  // Check how many times a ray from the point intersects the line segments
  let intersectCount = 0;
  if (point[1] > calculateY(point[0], slope1, yIntercept1)) {
    intersectCount++;
  }
  if (point[1] > calculateY(point[0], slope2, yIntercept2)) {
    intersectCount++;
  }
  if (point[1] < calculateY(point[0], slope3, yIntercept3)) {
    intersectCount++;
  }
  if (point[1] < calculateY(point[0], slope4, yIntercept4)) {
    intersectCount++;
  }

  return intersectCount;
}

function getSlope(point1, point2) {
  return (point2[1] - point1[1]) / (point2[0] - point1[0]);
}

function getYIntercept(point, slope) {
  return point[1] - slope * point[0];
}

function calculateY(x, slope, yIntercept) {
  return slope * x + yIntercept;
}



// LLM chatgpt: Replace the corresponent function (getRandomInt, getRandomInt, getRandomBoolean, getRandomString, getRandomToken, getRandomDate) in front of each key inside the Original Big JSON. This is the original big JSON:
let {credentials, testDevices, jueputacalletano} = require('../myvars')

function buildMsg(device) {
  return {
    "position": {
      "id": getRandomInt(0, 100000),
      "attributes": {
        "priority": getRandomInt(1, 10),
        "sat": getRandomInt(0, 15),
        "event": getRandomInt(0, 1000),
        "ignition": getRandomBoolean(),
        "motion": getRandomBoolean(),
        "workMode": getRandomInt(0, 10),
        "rssi": getRandomInt(0, 10),
        "gpsStatus": getRandomInt(0, 3),
        "di1": getRandomInt(0, 1),
        "out1": getRandomBoolean(),
        "di2": getRandomInt(0, 1),
        "io202": getRandomInt(0, 65535),
        "io204": getRandomInt(0, 65535),
        "io211": getRandomInt(0, 65535),
        "io213": getRandomInt(0, 65535),
        "io215": getRandomInt(0, 65535),
        "io113": getRandomInt(0, 65535),
        "io263": getRandomInt(0, 65535),
        "io303": getRandomInt(0, 65535),
        "pdop": getRandomInt(1, 10) / 10,
        "hdop": getRandomInt(1, 10) / 10,
        "power": getRandomInt(0, 30) + Math.random(),
        "io24": getRandomInt(0, 65535),
        "io206": getRandomInt(0, 65535),
        "battery": getRandomInt(0, 100) / 10,
        "io68": getRandomInt(0, 65535),
        "adc1": getRandomInt(0, 1023),
        "io327": getRandomInt(0, 65535),
        "operator": getRandomInt(0, 1000000),
        "tripOdometer": getRandomInt(0, 1000),
        "odometer": getRandomInt(0, 100000),
        "temp1": getRandomInt(-40, 85) + Math.random(),
        "temp2": getRandomInt(-40, 85) + Math.random(),
        "temp3": getRandomInt(-40, 85) + Math.random(),
        "io75": getRandomInt(0, 65535),
        "di4": getRandomInt(0, 1),
        "io483": getRandomInt(0, 65535),
        "io449": getRandomInt(0, 65535),
        "io636": getRandomInt(0, Number.MAX_SAFE_INTEGER),
        "io11": getRandomInt(0, Number.MAX_SAFE_INTEGER),
        "io76": getRandomInt(0, Number.MAX_SAFE_INTEGER),
        "io77": getRandomInt(0, 65535),
        "io79": getRandomInt(0, 65535),
        "io71": getRandomInt(0, 65535),
        "io238": getRandomInt(0, 65535),
        "io14": getRandomInt(0, Number.MAX_SAFE_INTEGER),
        "io387": getRandomToken(64),
        "distance": getRandomInt(0, 100000),
        "totalDistance": getRandomInt(0, 100000),
        "driverUniqueId": getRandomString(16),
        "hours": getRandomDate(new Date(2000, 0, 1), new Date()),
      },
      "deviceId": getRandomInt(100, 999),
      "protocol": "teltonika",
      "serverTime": new Date(),
      "deviceTime": new Date(),
      "fixTime": new Date(),
      "outdated": getRandomBoolean(),
      "valid": getRandomBoolean(),
      "latitude": getRandomFloat(-90, 90),
      "longitude": getRandomFloat(-180, 180),
      "altitude": getRandomFloat(0, 5000),
      "speed": getRandomFloat(0, 200),
      "course": getRandomFloat(0, 360),
      "accuracy": getRandomFloat(0, 100),
    },
    "device": {
      "id": getRandomInt(100, 999),
      "attributes": {},
      "groupId": getRandomInt(0, 10),
      "name": device.name,
      "uniqueId": device.token, // importan !!
      "status": "online",
      "lastUpdate": getRandomDate(new Date("2022-01-01"), new Date()),
      "positionId": getRandomInt(10000000, 99999999),
      "geofenceIds": [],
      "phone": "",
      "model": "",
      "contact": "",
      "disabled": getRandomBoolean(),
    }
  }
};


async function sendMessageToDevice(deviceId, message) {
  const url = `https://${credentials.dns}/api/v1/${deviceId}/telemetry`;
  const headers = {
    'Content-Type': 'application/json'
  };
  const body = JSON.stringify(message);
  try {
    const response = await fetch(url, { method: 'POST', headers, body });
    log(`Message sent to device ${deviceId}:`); // response
  } catch (error) {
    console.error(`Error sending message to device ${deviceId}:`, error);
  }
}

// Test random generation
// let point1 = [21.038764, -86.875932]
// let point2 = [21.033697, -86.868137]
// let point3 = [21.034798, -86.867333]
// let point4 = [21.039685, -86.875372]
// console.log(getRandomPointInsideArea(point1, point2, point3, point4))

let start = performance.now()

function main(){
  for(device of testDevices.slice(0,4)){
    log(device.name, device.token)
    let msgBody = buildMsg(device);
    log(msgBody)
  }
}
main()

log(performance.now() - start)