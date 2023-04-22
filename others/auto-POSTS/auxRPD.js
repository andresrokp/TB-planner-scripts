// ----- hash for latitude and longitude of airports

/*
gpt:  Please give me the latitude an longitude of the next airports as a json object

  CUN
  VER
  MEX
  BJX
  SJD
  MID
  GDL
  MTY
  PVR
  ZIH
*/

const AIRPORT_COORDINATES = {
  CUN: {
    latitude: 21.0405,
    longitude: -86.8748,
  },
  VER: {
    latitude: 19.1448,
    longitude: -96.1866,
  },
  MEX: {
    latitude: 19.4363,
    longitude: -99.0721,
  },
  BJX: {
    latitude: 20.9935,
    longitude: -101.4808,
  },
  SJD: {
    latitude: 23.1518,
    longitude: -109.721,
  },
  MID: {
    latitude: 20.9367,
    longitude: -89.6577,
  },
  GDL: {
    latitude: 20.5235,
    longitude: -103.3112,
  },
  MTY: {
    latitude: 25.7783,
    longitude: -100.107,
  },
  PVR: {
    latitude: 20.6801,
    longitude: -105.2531,
  },
  ZIH: {
    latitude: 17.6068,
    longitude: -101.4606,
  },
};

// ----- random message generation

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

/*
  LLM chatGPT: I want the posibility to modify randomly any of the key values in 
  the propper data type an range with coherent min and max. Insert the random 
  function in the same line of the JSON key name with propper values inside the function 
  like this example
  
  >> example begin:
  {
      "position": {
          "id": a random funtion for whole number,
          "attributes": {
              "priority": a random whole number up to 5,
              "sat": 8,
              "event": a random whole up to 999,

  // LLM chatgpt: Replace the corresponent function (getRandomInt, getRandomInt, 
  getRandomBoolean, getRandomString, getRandomToken, getRandomDate) in front of 
  each key inside the Original Big JSON. This is the original big JSON:
*/

module.exports.buildMsg = function buildMsg(device) {
  return {
    position: {
      id: getRandomInt(0, 100000),
      attributes: {
        priority: getRandomInt(1, 10),
        sat: getRandomInt(0, 15),
        event: getRandomInt(0, 1000),
        ignition: getRandomBoolean(),
        motion: getRandomBoolean(),
        workMode: getRandomInt(0, 10),
        rssi: getRandomInt(0, 10),
        gpsStatus: getRandomInt(0, 3),
        di1: getRandomInt(0, 1),
        out1: getRandomBoolean(),
        di2: getRandomInt(0, 1),
        io202: getRandomInt(0, 65535),
        io204: getRandomInt(0, 65535),
        io211: getRandomInt(0, 65535),
        io213: getRandomInt(0, 65535),
        io215: getRandomInt(0, 65535),
        io113: getRandomInt(0, 65535),
        io263: getRandomInt(0, 65535),
        io303: getRandomInt(0, 65535),
        pdop: getRandomInt(1, 10) / 10,
        hdop: getRandomInt(1, 10) / 10,
        power: getRandomInt(0, 30) + Math.random(),
        io24: getRandomInt(0, 65535),
        io206: getRandomInt(0, 65535),
        battery: getRandomInt(0, 100) / 10,
        io68: getRandomInt(0, 65535),
        adc1: getRandomInt(0, 1023),
        io327: getRandomInt(0, 65535),
        operator: getRandomInt(0, 1000000),
        tripOdometer: getRandomInt(0, 1000),
        odometer: getRandomInt(0, 100000),
        temp1: getRandomInt(-40, 85) + Math.random(),
        temp2: getRandomInt(-40, 85) + Math.random(),
        temp3: getRandomInt(-40, 85) + Math.random(),
        io75: getRandomInt(0, 65535),
        di4: getRandomInt(0, 1),
        io483: getRandomInt(0, 65535),
        io449: getRandomInt(0, 65535),
        io636: getRandomInt(0, Number.MAX_SAFE_INTEGER),
        io11: getRandomInt(0, Number.MAX_SAFE_INTEGER),
        io76: getRandomInt(0, Number.MAX_SAFE_INTEGER),
        io77: getRandomInt(0, 65535),
        io79: getRandomInt(0, 65535),
        io71: getRandomInt(0, 65535),
        io238: getRandomInt(0, 65535),
        io14: getRandomInt(0, Number.MAX_SAFE_INTEGER),
        io387: getRandomToken(64),
        distance: getRandomInt(0, 100000),
        totalDistance: getRandomInt(0, 100000),
        driverUniqueId: getRandomString(16),
        hours: getRandomDate(new Date(2000, 0, 1), new Date()),
      },
      deviceId: getRandomInt(100, 999),
      protocol: "teltonika",
      serverTime: new Date(),
      deviceTime: new Date(),
      fixTime: new Date(),
      outdated: getRandomBoolean(),
      valid: getRandomBoolean(),
      latitude: getRandomFloat(-90, 90),
      longitude: getRandomFloat(-180, 180),
      altitude: getRandomFloat(0, 5000),
      speed: getRandomFloat(0, 200),
      course: getRandomFloat(0, 360),
      accuracy: getRandomFloat(0, 100),
    },
    device: {
      id: getRandomInt(100, 999),
      attributes: {},
      groupId: getRandomInt(0, 10),
      name: device.name,
      uniqueId: device.token, // importan !!
      status: "online",
      lastUpdate: getRandomDate(new Date("2022-01-01"), new Date()),
      positionId: getRandomInt(10000000, 99999999),
      geofenceIds: [],
      phone: "",
      model: "",
      contact: "",
      disabled: getRandomBoolean(),
    },
  };
};
