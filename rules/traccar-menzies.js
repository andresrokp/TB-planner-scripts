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