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

module.exports.buildMsg = function buildMsg(device,idx) {
  return {
    position: {
      id: getRandomInt(5000, 10000),
      attributes: {
        priority: getRandomInt(1, 10),
        sat: getRandomInt(5, 20),
        event: getRandomInt(0, 1000),
        ignition: getRandomBoolean(),
        motion: getRandomBoolean(),
        gpsStatus: getRandomInt(0, 3),
        di1: getRandomBoolean(),
        out1: getRandomBoolean(),
        di2: getRandomInt(0, 1),
        io248: 1,
        pdop: getRandomInt(5, 60) / 10,
        hdop: getRandomInt(5, 60) / 10,
        power: getRandomInt(12000, 14000) / 1000,
        io24: 0,
        battery: getRandomInt(4000, 4100) / 1000,
        io68: 0,
        axisX: getRandomInt(-3000,3000),
        axisY: getRandomInt(-3000,3000),
        axisZ: getRandomInt(-3000,2000),
        io327: getRandomInt(5000, 60000),
        operator: getRandomInt(100000, 900000),
        tripOdometer: getRandomInt(1000, 2000),
        odometer: getRandomInt(2000, 3000),
        temp1: getRandomInt(180, 700) / 10 ,
        io483: getRandomInt(10000, 20000),
        io449: getRandomInt(10000, 20000),
        io76: getRandomInt(Number.MAX_SAFE_INTEGER*0.5, Number.MAX_SAFE_INTEGER),
        driverUniqueId: getRandomString(16),
        distance: getRandomInt(0, 1000),
        totalDistance: getRandomInt(3000, 6000),
        hours: getRandomInt(10000000,30000000),
      },
      deviceId: getRandomInt(100, 999),
      protocol: "teltonika",
      serverTime: new Date(),
      deviceTime: new Date(),
      fixTime: new Date(),
      outdated: getRandomBoolean(),
      valid: getRandomBoolean(),
      latitude: AIRPORT_COORDINATES[device.estacion].latitude + getRandomInt(1,20)/10000,
      longitude: AIRPORT_COORDINATES[device.estacion].longitude + getRandomInt(1,20)/10000,
      altitude: getRandomFloat(1000, 2000),
      speed: getRandomFloat(0, 60),
      course: getRandomFloat(0, 360),
      accuracy: idx,
    },
    device: {
      id: getRandomInt(100, 999),
      attributes: {},
      groupId: 5,
      name: device.name,
      uniqueId: device.token, // importan !!
      status: "online",
      lastUpdate: getRandomDate(new Date("2022-01-01"), new Date()),
      positionId: getRandomInt(10000000, 99999999),
      geofenceIds: [],
      phone: "",
      model: "",
      contact: "",
      category: "plane",
      disabled: false,
    },
  };
};
