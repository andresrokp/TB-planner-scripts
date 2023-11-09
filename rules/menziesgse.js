function switchScript_msgTypeSelector() {
    var isTelemetry = msg.driverUniqueId || msg.geofenceIds || msg.fuel || msg.battery;
    if(!isChecklist && isTelemetry && msgType === 'POST_TELEMETRY_REQUEST') {
        return ['teltry'];
    }
    
    var isChecklist = msg.calcasSafety || msg.correoDiligenciante || msg.lucesFrontales;
    if (isChecklist && !isTelemetry){
        return['check'];
    }
    
    var isEcopetrol = metadata.deviceType == 'VEHICULOS_ECOP';
    
    if (isEcopetrol){
        return['ecop'];
    } else if(msgType === 'POST_ATTRIBUTES_REQUEST') {
        return ['atts'];
    } else {
        return ['none'];
    }
}


function filterScript_checkNoCumple() {
    for (var e in msg){
        if (msg[e] == 0) return true;
    }
    return false    
}

function filterScript_buenaFecha() {
    var today = new Date();
    var currentYear = today.getFullYear();

    var fixTime = new Date(msg.position.fixTime);
    var fixTimeYear = fixTime.getFullYear();

    return currentYear == fixTimeYear;    
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
    msg.power = Math.floor(msg.power*10)/10
    if(msg.power < 8) delete msg.power

    //----------------------------------------------------------
    //TEMPERATURE
    msg.temp1 = Math.floor(msg.temp1*10)/10
    if(msg.temp1 < 40) delete msg.temp1

    //----------------------------------------------------------
    //DRIVER
    if(metadata.driverUniqueId){
        if(metadata.driverUniqueId.replaceAll('"','') == msg.driverUniqueId)
            delete msg.driverUniqueId;
    }
    if(msg.driverUniqueId)
    {
        if (metadata.driverData){
            var driverData = JSON.parse(metadata.driverData);
            msg.driverName = driverData.nombreEmpleado;
        }else{
            msg.driverName = 'Usuario desconocido'
        }
        if (msg.buzzer) msg.driverName = 'Conductor no logueado'
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
        
        // A logging schema to debug
        // msg.logToDeleteOriginalMeta = metadata.geofenceIds;
        // msg.logToDeleteJSON = JSON.parse(metadata.geofenceIds).toString();
        // msg.logToDeleteReplace = metadata.geofenceIds.replaceAll('"','').replace('[','').replace(']','');
        // msg.logToDeleteOriginalData = msg.geofenceIds;
        // msg.logToDeleteStringData = msg.geofenceIds.toString();
        
        if(metadata.geofenceIds.replaceAll('"','').replace('[','').replace(']','') == msg.geofenceIds.toString())
            { delete msg.geofenceIds }
    }
    if(msg.geofenceIds){
        msg.geofenceNames = [];
        var mapaDeCercas = {
            36:"SJD",
            37:"Terminal 2",
            38:"Terminal 1",
            39:"La Mesa",
            40:"San Javier",
            41:"La Gran Vía",
            42:"El Colegio",
            43:"Anapioma",
            45:"Apulo",
            47:"Girardot",
            48:"Tocaima",
            49:"Ricaurte",
            50: "Terminal 1", //VER
            51: "Taller", //VER
            52: "Terminal 2", //MEX
            53: "Terminal 1", //MEX
            54: "VER",
            55: "GDL",
            56: "MEX",
            57: "Terminal 2", //GDL
            58: "Terminal 1", //GDL
            59: "Terminal 1", //BOG
            60: "T. Carga",
            61: "Terminal 2", //BOG
            62: "BOG",
            63: "SJD-Ciudad, San Bernabé",
            64: "SJD-Ciudad, San José Viejo",
            65: "SJD-Ciudad, El Zacatal",
            66: "SJD-Ciudad, Santa Rosa",
            69: "SJD-Ciudad, Las Veredas",
            70: "CUN"
        };
        msg.geofenceIds.forEach( function (e,i)
            {
                msg.geofenceNames[i] = mapaDeCercas[e] || msg.geofenceIds[i];
                
            });
    }

    //----------------------------------------------------------
    //EMERGENCY
    if(metadata.emergency){
        if(metadata.emergency.replaceAll('"','') == msg.emergency)
            delete msg.emergency
    }

    //----------------------------------------------------------
    //SPEED
    msg.speed = msg.speed * 1.6 // from miles to Km
    msg.speed = Math.floor(msg.speed*10)/10 // from miles to Km
    if(msg.speed > 100) delete msg.speed

    //----------------------------------------------------------
    //ACCELERATIONS
    var resultanteXYZ = Math.sqrt(Math.pow(msg.axisX, 2) + Math.pow(msg.axisY, 2) + Math.pow(msg.axisZ, 2));
    msg.resultanteXYZ = Math.floor(resultanteXYZ*10)/10;


    //----------------------------------------------------------
    //KILOMETRAJE
    // Function to calculate geodetic distance between two points
    function calculateDistance(lat1, lon1, alt1, lat2, lon2, alt2) {
        // Define the WGS84 parameters
        var WGS84 = {
        a: 6378137,  // Semi-major axis (equatorial radius) in meters
        b: 6356752.3142,  // Semi-minor axis (polar radius) in meters
        };
        // Convert latitude and longitude from degrees to radians
        var lat1Rad = lat1 * (Math.PI / 180);
        var lon1Rad = lon1 * (Math.PI / 180);
        var lat2Rad = lat2 * (Math.PI / 180);
        var lon2Rad = lon2 * (Math.PI / 180);
        // Calculate the differences in latitude and longitude
        var dLat = lat2Rad - lat1Rad;
        var dLon = lon2Rad - lon1Rad;
        // Calculate the haversine of half the differences
        var a = Math.pow(Math.sin(dLat / 2),2) + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.pow( Math.sin(dLon / 2) , 2);
        // Calculate the central angle using the haversine formula
        var centralAngle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        // Calculate the distance on the ellipsoid's surface
        var surfaceDistance = WGS84.a * centralAngle;
        // Calculate the altitude difference
        // var altDiff = Math.abs(alt2 - alt1);
        // Calculate the geodetic distance considering altitude
        // var geodeticDistance = Math.sqrt(surfaceDistance ** 2 + altDiff ** 2);
        
        return surfaceDistance; //geodeticDistance
    }

    // Ejecución:
    msg.lat1 = parseFloat(msg.latitude);
    msg.lon1 = parseFloat(msg.longitude);

    msg.lat2 = parseFloat(( metadata.latitude|| (msg.latitude || '0').toString() ).replace(/"/g, ""));
    msg.lon2 = parseFloat(( metadata.longitude|| (msg.longitude || '0').toString() ).replace(/"/g, ""));

    var deltaDistancia = Math.round( calculateDistance(msg.lat1, msg.lon1, 0, msg.lat2, msg.lon2, 0) * 100) / 100000; //Km
    msg.deltaDistancia = deltaDistancia;

    var prevAcumuladoDistancia = parseFloat((metadata.acumuladoDistancia || "0").replace(/"/g, ""));
    var acumuladoDistancia = prevAcumuladoDistancia + (deltaDistancia || 0);
    msg.acumuladoDistancia = Math.round( acumuladoDistancia * 10000 ) / 10000;


    //----------------------------------------------------------
    //HOROMETRO

    var ajusteHorometro = parseFloat((metadata.ss_ajusteHorometro || "0").replace(/"/g, ""));
    msg.horometerAltAdjusted = msg.horometerAlt + ajusteHorometro;

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

function longStringsSanitizer() {
    for(var key in msg) {
        if (typeof msg[key] === 'string' && msg[key].length > 100) {
          msg[key] = msg[key].slice(0, 100);
        }
        if (msg[key] == null) {
          msg[key] = 0;
        }
    }
    
    // DELETION OF THE LOGGING STRATEGY FROM PREVIOUS NODE SCRIPT
    delete msg.logToDeleteOriginalMeta;
    delete msg.logToDeleteJSON;
    delete msg.logToDeleteReplace;
    delete msg.logToDeleteOriginalData;
    delete msg.logToDeleteStringData;
    
    return {msg: msg, metadata: metadata, msgType: msgType};
}

function filterNonLoggedDriverAlarm() {
    if (metadata.buzzer) {
    
        var buzzerData = JSON.parse(metadata.buzzer);
        
        var hasTrueValue = false;
        var firstTimestamp = 0;
        var lastTimestamp = 0;
        
        buzzerData.forEach ( function (entry) {
            if (entry.value === true) {
                if (!hasTrueValue) {
                    firstTimestamp = entry.ts;
                }
                lastTimestamp = entry.ts;
                hasTrueValue = true;
            }
        });
    
        if (hasTrueValue && lastTimestamp - firstTimestamp > 20000) {
            return true;
        }
        
    }
    return false;    
}

function filterScript_onlyiButtonTaller() {
    var msgMto = {};

    if ( msg.driverName.test(/entrada/i) ) {
        msgMto = {
            enTaller: true,
            enServicio: false
        };
    } else {
        msgMto = {
            enTaller: false,
            enServicio: true
        };
    }
    
    return {msg: msgMto, metadata: metadata, msgType: "POST ATTRIBUTE DATA"};
}


function script_adaptNoCumpleListForAlarm() {
    var noCumpleList = [];
    
    for (var prop in msg){
        if (prop === 0) noCumpleList.push(prop);
    }
    
    return {msg: {noCumpleList:noCumpleList}, metadata: metadata, msgType: msgType};
}
