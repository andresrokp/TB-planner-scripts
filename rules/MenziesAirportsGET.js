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
// TO FILTER FLIGTHS IN A TIME RANGE
// var offset = parseInt(metadata.utcTimeOffset);
// var presentTime = new Date().getTime();
// var intervalStart = presentTime +  (-0.2 + offset)*60*60*1000;
// var intervalEnd = presentTime +  (12 + offset)*60*60*1000;
// var scheduledTime = new Date(msg.arrival.scheduledTime).getTime();
// var isInTime = scheduledTime > intervalStart && scheduledTime < intervalEnd; 

var patterns = [
    /^N[^\w]*3[^\w]*3[^\w]*0[^\w]*Q[^\w]*T$/,
    /^N[^\w]*3[^\w]*3[^\w]*1[^\w]*Q[^\w]*T$/,
    /^N[^\w]*3[^\w]*3[^\w]*2[^\w]*Q[^\w]*T$/,
    /^N[^\w]*3[^\w]*3[^\w]*3[^\w]*Q[^\w]*T$/,
    /^N[^\w]*3[^\w]*3[^\w]*4[^\w]*Q[^\w]*T$/,
    /^N[^\w]*3[^\w]*3[^\w]*5[^\w]*Q[^\w]*T$/,
    /^N[^\w]*3[^\w]*3[^\w]*6[^\w]*Q[^\w]*T$/,
    /^X[^\w]*A[^\w]*U[^\w]*Y[^\w]*R$/,
    /^X[^\w]*A[^\w]*G[^\w]*G[^\w]*L$/,
    /^X[^\w]*A[^\w]*E[^\w]*F[^\w]*R$/,
    /^X[^\w]*A[^\w]*L[^\w]*R[^\w]*C$/,
    /^X[^\w]*A[^\w]*L[^\w]*R[^\w]*F$/,
  ];
  
  var isInCargoRegNums = patterns.some(function(e){
      e.test(msg.aircraft_registration);
  });
  
  // var isAvianca = /avianca/i.test(msg.airline_name);
  
  var isFedex = /fedex/i.test(msg.airline_name);
  var isAerounion = /aerounion/i.test(msg.airline_name);
  var isMartinair = /martinair/i.test(msg.airline_name);
  
  var isCargo = isInCargoRegNums || isFedex || isAerounion || isMartinair;
  
  metadata.isCargo;
  
  
  
  return isCargo;
}

function msgTransformationToTelemetry(msg) {
    var msgForTelemetry = {
        ts : Date.now(),
        values:{
            flightIataNumber : msg.flight_number,
            aircraft_registration : msg.aircraft_registration,
            airlineName : msg.airline_name,
            departureIataCode : msg.origin,
            arrivalScheduledTime : msg.arrival_time,
            arrivalEstimatedTime : msg.eta_time,
            flightStatus : msg.status_text
        }
    };
    
    return {msg: msgForTelemetry, metadata: {}, msgType: msgType};  
}