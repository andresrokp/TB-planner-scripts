function transformMessage(message, metadata, msgType) {
    // Extract necessary information from the message object
    const { position, device } = message;
    const { attributes } = position;

    // Construct message payload with desired fields
    const payload = {
        "ts": new Date(position.fixTime).valueOf(),
        "values": {
            //msg.position.attributes
            "sat": attributes.sat,
            "event": attributes.event,
            "ignition": attributes.ignition,
            "motion": attributes.motion,
            "emergencias": attributes.di1,
            "start": attributes.out1,
            "proximity": attributes.di2,
            "pdop": attributes.pdop, // general presicion
            "hdop": attributes.hdop, // horizontal presicion
            "power": attributes.power,
            "battery": attributes.battery,
            "io68": attributes.io68,
            "axisX": attributes.axisX,
            "axisY": attributes.axisY,
            "axisZ": attributes.axisZ,
            "io327": attributes.io327,
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
        },
    };

    // Return transformed message with new payloads and message type
    return {
        msg: payload,
        metadata: { token: device.uniqueId },
        msgType: msgType,
    };
}
