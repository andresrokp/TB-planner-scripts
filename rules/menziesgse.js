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


// Genera una nueva telesmetría Del combustible en unidades de galones y litros
function fuelProcessing(){
        
    // Si se sale de rango, fuel toma el valor previo
    if(parseInt(msg.fuel) > 5000) {
        msg.fuel = msg.fuel - msg.deltaFuel;
        msg.deltaFuel = 0;
    }

    // // Accumulate deltas in consumption only if inside el rango
    // learn: metadata previous value is a string WITH QUOTES
    // learn: if uncontroled, feedback prev vals can lead to overflow
    // learn: here let and const no valen de ni mondá

    var prevFuelSuministro = metadata.fuelSuministro;
    if(prevFuelSuministro){
        msg.fuelSuministro = parseInt(prevFuelSuministro.replaceAll('"',''));
        msg.fuelSuministro += msg.deltaFuel > 0 ? msg.deltaFuel : 0;
        if (prevFuelSuministro.length > 50) msg.fuelSuministro = 0;
    }else{
        msg.fuelSuministro = 0;
    }

    var prevFuelConsumo = metadata.fuelConsumo;
    if(prevFuelConsumo){
        msg.fuelConsumo = parseInt(prevFuelConsumo.replaceAll('"',''))
        msg.fuelConsumo +=  msg.deltaFuel < 0 ? Math.abs(msg.deltaFuel) : 0;
        if (prevFuelConsumo.length > 50) msg.fuelConsumo = 0
    }else{
        msg.fuelConsumo = 0
    }

    // conversions... maybe to errase
    var lt = msg.fuel * metadata.shared_mm_to_lt;
    msg.fuelLt = lt;
    msg.fuelGal = lt * 0.264172;

    return {msg: msg, metadata: metadata, msgType: "POST_TELEMETRY_REQUEST"};
}


//Categorizar el nivel de la alarma para combustible según porcentajes de relación respecto al rango total
function switchAlarmaFuel(){
    var value = msg.fuel
    var min_fuel = metadata.shared_min_fuel;
    var max_fuel = metadata.shared_max_fuel;

    var percentage = (value-min_fuel)/(max_fuel-min_fuel) * 100;

    if (percentage < 15) return['critical']
    if (percentage > 25) return['good']
    return ['major']
}




