function buenFecha_fiterNode(params) {
    var today = new Date();
    var currentYear = today.getFullYear();
    
    var fixTime = new Date(msg.position.fixTime);
    var fixTimeYear = fixTime.getFullYear();
    
    return currentYear == fixTimeYear;
}

function isBLE_filter(params) {
    return !!msg.position.attributes.beacon1Namespace || !!msg.position.attributes.beacon1Uuid ?  true : false;
}

function esBuenMensaje_filter(params) {
    return !!msg.position.attributes.sat && !!msg.position.attributes.sat.io449 ?  msg.position.attributes.sat > 6 : false;
}

function beaconNonZeroLatLon_filter(params) {
    return msg.position.latitude != 0 && msg.position.longitude != 0;
}

function msgTransformador_script(params) {
    // Extract data
    var device = msg.device;
    var position = msg.position;
    var attributes = position.attributes;

    // Construct new plain msg
    var newMsg = {
        "ts": new Date(position.fixTime).valueOf(),
        "values": {
            //msg.position.attributes
            "sat": attributes.sat,
            "event": attributes.event,
            "ignition": attributes.ignition,
            "motion": attributes.motion,
            "emergency": attributes.di1,
            "buzzer": attributes.out1,
            "proximity": attributes.di2,
            "pdop": attributes.pdop, // general presicion
            "hdop": attributes.hdop, // horizontal presicion
            "power": attributes.power,
            "battery": attributes.battery,
            "io68": attributes.io68,
            "axisX": attributes.axisX,
            "axisY": attributes.axisY,
            "axisZ": attributes.axisZ,
            "fuel": attributes.io327,
            "tripOdometer": attributes.tripOdometer,
            "odometer": attributes.odometer,
            "temp1": attributes.temp1,
            "io483": attributes.io483,
            "horometerAlt": attributes.io449,
            "rssi": attributes.rssi,
            "io200": attributes.io200,
            "io248": attributes.io248,
            "adc1": attributes.adc1,
            "io24": attributes.io24,
            "driverUniqueId": attributes.driverUniqueId,
            "beacon1Uuid": attributes.beacon1Uuid,
            // msg.position
            "outdated": position.outdated,
            "valid": position.valid,
            "latitude": position.latitude,
            "longitude": position.longitude,
            "speed": position.speed,
            "course": position.course,
            "accuracy": position.accuracy,
            //msg.device
            "lastUpdate": new Date(device.lastUpdate).valueOf(),
            "geofenceIds": device.geofenceIds,
            "devicename": device.name
        },
    };

    // Return transformed message
    return {
        msg: newMsg,
        metadata: { token: device.uniqueId },
        msgType: msgType,
    };
}

function name(params) {
    var atts = msg.position.attributes
    var beaconMsgArray = [];
    if (!!atts.beacon1Namespace){
        
        // Iterate all atts . beacon1Namespace
        for (var key in atts) {
          // Take 1 of each beacon
          if ( /beacon/i.test(key) && /Namespace/i.test(key)) {
            var beaconNumber = key.replace(/\D/g, "");
            
            // Complete that beacon atts strings
            var namespaceKey = 'beacon'+beaconNumber+'Namespace';
            // var instanceKey = 'beacon'+beaconNumber+'Instance';
            var rssiKey = 'beacon'+beaconNumber+'Rssi';
        
            // Create an object with the 3 beacon atts
            var beaconMsg = {
                ts: new Date(msg.position.fixTime).valueOf(),
                namespace: atts[namespaceKey],
                // instance: atts[instanceKey],
                rssi: atts[rssiKey],
                latitude: msg.position.latitude == 0 ? 4.700001 : msg.position.latitude,
                longitude: msg.position.longitude == 0 ? -74.140001 : msg.position.longitude,
                vehicleName: msg.device.name,
                vehicleId: msg.device.uniqueId,
                geofenceIds: msg.device.geofenceIds
            };
            beaconMsgArray.push(beaconMsg);
          }
        }
    }
    
    return {msg: beaconMsgArray, metadata: metadata, msgType: msgType};
    
    
    /*
    {
        "position": {
            "id": 0,
            "attributes": {
                "priority": 0,
                "sat": 19,
                "event": 385,
                "beacon1Uuid": "0000999900001000800000177a000002",
                "beacon1Major": 43690,
                "beacon1Minor": 48059,
                "beacon1Rssi": -100,
                "distance": 0.0,
                "totalDistance": 1.7952659504E8,
                "motion": false,
                "hours": 5020316423
            },
            "deviceId": 1002,
            "protocol": "teltonika",
            "serverTime": "2024-02-19T16:46:41.387+00:00",
            "deviceTime": "2024-02-19T16:46:32.011+00:00",
            "fixTime": "2024-02-19T16:46:32.011+00:00",
            "outdated": false,
            "valid": true,
            "latitude": 4.7008183,
            "longitude": -74.143965,
            "altitude": 2582.0,
            "speed": 0.0,
            "course": 38.0,
            "accuracy": 0.0
        },
        "device": {
            "id": 1002,
            "attributes": {},
            "groupId": 5,
            "name": "bog - 17 - 860896053043535",
            "uniqueId": "860896053043535",
            "status": "online",
            "lastUpdate": "2024-02-19T16:46:41.387+00:00",
            "positionId": 17658904,
            "geofenceIds": [],
            "phone": "",
            "model": "",
            "contact": "",
            "disabled": false
        }
    }
    
    {
        "position": {
            "id": 0,
            "attributes": {
                "priority": 0,
                "sat": 18,
                "event": 385,
                "beacon1Namespace": "16f03fc089d155aac19a",
                "beacon1Instance": "ea6a347c0055",
                "beacon1Rssi": -71,
                "distance": 0.0,
                "totalDistance": 2.477801613E7,
                "motion": false
            },
            "deviceId": 1066,
            "protocol": "teltonika",
            "serverTime": "2024-02-22T21:11:48.291+00:00",
            "deviceTime": "2024-02-22T21:11:46.011+00:00",
            "fixTime": "2024-02-22T21:11:46.011+00:00",
            "outdated": false,
            "valid": true,
            "latitude": 4.6929666,
            "longitude": -74.1325733,
            "altitude": 2583.0,
            "speed": 0.0,
            "course": 49.0,
            "accuracy": 0.0
        },
        "device": {
            "id": 1066,
            "attributes": {},
            "groupId": 5,
            "name": "BOG - 287 - 863719062415618",
            "uniqueId": "863719062415618",
            "status": "online",
            "lastUpdate": "2024-02-22T21:11:48.292+00:00",
            "positionId": 18466620,
            "geofenceIds": [],
            "phone": "",
            "model": "",
            "contact": "",
            "disabled": false
        }
    }
    */
}