/**
 * Rulechain Architecture
 * 
 * > Generator node from AN Airport
 * > rest http GET node to flights API to fetch scheduled flights of THE Airport
 * > split array node to serialize the big fetch into individual fligths JSON
 * > filter node to only keep the schedules inside a timeframe
 * >
 * 
 */


function generadorParaAirports() {
    var msg = {};
    var metadata = { 'tz': 'America/Bogota' };
    var msgType = "POST_TELEMETRY_REQUEST";

    return { msg: msg, metadata: metadata, msgType: msgType };
    
}



let msg = {
    "airline": {
        "iataCode": "VE",
        "icaoCode": "EFY",
        "name": "EasyFly"
    },
    "arrival": {
        "actualRunway": null,
        "actualTime": null,
        "baggage": null,
        "delay": null,
        "estimatedRunway": null,
        "estimatedTime": null,
        "gate": null,
        "iataCode": "BOG",
        "icaoCode": "SKBO",
        "scheduledTime": "2023-08-21T14:33:00.000",
        "terminal": "2"
    }
}
function filterOnlyScheduledInsideTime(msg, metadata) {
    var offset = parseInt(metadata.utcTimeOffset);

    var presentTime = new Date().getTime();
    
    var intervalStart = presentTime +  (-2 + offset)*60*60*1000;
    var intervalEnd = presentTime +  (48 + offset)*60*60*1000;
    
    var scheduledTime = new Date(msg.arrival.scheduledTime).getTime();
    
    return scheduledTime > intervalStart && scheduledTime < intervalEnd; 
}

console.log(filterOnlyScheduledInsideTime(msg, {utcTimeOffset: '-5'}));