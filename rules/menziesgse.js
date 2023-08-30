function msgTypeSelector() {
    let isChecklist = msg.nivelAceiteMotor || msg.nivelCombustible || msg.lucesFrontales;

    let isTelemetry = msg.driverUniqueId || msg.geofenceIds || msg.fuel || msg.battery

    if(msgType === 'POST_ATTRIBUTES_REQUEST') {
        return ['atts'];
    }
    if(msgType === 'POST_TELEMETRY_REQUEST' && isTelemetry && !isChecklist ) {
        return ['teltry'];
    }
    if (isChecklist && !isTelemetry){
        return['check']
    }
    return ['none']
    
}


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


// Procesa datos del mensaje (acumulación, no repeticón, conversión, etc)
function variablesProcessing(){
    // ---------------------------------------------------------------
    // FUEL ----------------------------------------------------------

    // Take delta to evaluate repeated values
    var prevFuel = parseInt((metadata.fuel||'0').replaceAll('"',''));
    var deltaFuel = msg.fuel - prevFuel
    // if dentro del rango and no repeated...
    if(parseInt(msg.fuel) > 300 && parseInt(msg.fuel) < 6000 && deltaFuel != 0) {
        // learn: metadata previous value is a string WITH QUOTES
        // learn: if uncontroled, feedback prev vals can lead to overflow
        msg.deltaFuel = deltaFuel
        var prevFuelConsumo = parseInt((metadata.fuelConsumo||'0').replaceAll('"',''));
        msg.fuelConsumo = prevFuelConsumo + (deltaFuel < 0 ? Math.abs(deltaFuel) : 0);
        // conversiones
        msg.fuelLt = msg.fuel * metadata.shared_mm_to_lt;
        msg.fuelConsumoLt = msg.fuelConsumo * metadata.shared_mm_to_lt;
    }else{  delete msg.fuel   }

    //----------------------------------------------------------
    //POWER
    if(msg.power < 8) delete msg.power

    //----------------------------------------------------------
    //DRIVER
    if(metadata.driverUniqueId){
        if(metadata.driverUniqueId.replaceAll('"','') == msg.driverUniqueId)
            delete msg.driverUniqueId
    }

    // //----------------------------------------------------------
    // //IGNITION
    if(metadata.ignition){
        if(metadata.ignition.replaceAll('"','') == msg.ignition)
            delete msg.ignition
    }

    //----------------------------------------------------------
    //GEOFENCES
    if(metadata.geofenceIds){
        if(metadata.geofenceIds.replaceAll('"','') == msg.geofenceIds)
            delete msg.geofenceIds
    }

    //----------------------------------------------------------
    //EMERGENCY
    if(metadata.emergency){
        if(metadata.emergency.replaceAll('"','') == msg.emergency)
            delete msg.emergency
    }

    //TODO: refactor the repetition filtering
    // >> An iteration over an array of keys

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




