function transformMsgToPlain(msg,metadata,msgType) {
    var tiempomilis = new Date (msg.device.lastUpdate);
    var timestamp_dispositivo = new Date (msg.position.fixTime);

    var mensaje_metadatos_tokem = {
        "tokem":msg.device.uniqueId,
    };

    var mensaje_datos = {
        "ts":timestamp_dispositivo.valueOf(),
        "values":{
            "latitude":msg.position.latitude,
            "longitude":msg.position.longitude,
            "sat": msg.position.attributes.sat,
            "event": msg.position.attributes.event,
            "di1": msg.position.attributes.di1,
            "di2": msg.position.attributes.di2,
            "pdop": msg.position.attributes.pdop, //PDOP < 1: Excelente1 <= PDOP <= 2: Bueno2 < PDOP <= 5: ModeradoPDOP > 5: Baja calida 
            "hdop": msg.position.attributes.hdop, //que la posición medida por el dispositivo tiene una buena precisión y calidad.
            "out1": msg.position.attributes.out1,
            "out2": msg.position.attributes.out2,
            "motion": msg.position.attributes.motion,
            "rssi": msg.position.attributes.rssi,
            "io200": msg.position.attributes.io200,
            "ignition": msg.position.attributes.ignition,
            "io248": msg.position.attributes.io248,
            "adc1": msg.position.attributes.adc1,
            "power": msg.position.attributes.power,
            "io24": msg.position.attributes.io24,
            "battery": msg.position.attributes.battery,
            "io68": msg.position.attributes.io68, // horometro
            "axisX": msg.position.attributes.axisX,
            "axisY": msg.position.attributes.axisY,
            "axisZ": msg.position.attributes.axisZ,
            "io327": msg.position.attributes.io327, // Fuel Sensor UL232 en milimetros
            "tripOdometer": msg.position.attributes.tripOdometer, // odometro por viaje(kms transcurrido desde encendido a apagado)
            "odometer": msg.position.attributes.odometer, // Kilometraje del vehículo  ------------------
            "temp1": msg.position.attributes.temp1,
            "driverUniqueId": msg.position.attributes.driverUniqueId, // Ibutton e identificacion de usuario/conductor
        // "distance": msg.position.attributes.distance,
        // "totalDistance": msg.position.attributes.totalDistance.toFixed(0),
        //  "hours":msg.position.attributes.hours,
            "outdated": msg.position.outdated,
            "valid":msg.position.valid, //indica que la información de posición obtenida es válida y confiable.
        //  "altitude": msg.position.altitude,
            "speed": msg.position.speed,
            "course": msg.position.course,
            "accuracy": msg.position.accuracy,
            "lastUpdate":tiempomilis.valueOf(),
            
        }
    }

    var mensaje_atributos = {
        "id":msg.device.id,
        "name":msg.device.name,
        "uniqueId":msg.device.uniqueId,
        "lastUpdate":tiempomilis.valueOf(),
        "protocol":msg.position["protocol"],
        "category": msg.device.category,
    }

    return {msg: mensaje_datos, metadata: mensaje_metadatos_tokem, msgType: msgType};
}