var milisegundos = new Date(msg[0].system.updated);
      
var mensajetransformador = {
    "ts": milisegundos.valueOf(),
    "values":{
      "aircraft": msg[0].aircraft.iataCode,
      "status": msg[0].status,
      "speedkph":msg[0].speed.horizontal,
      "category": msg[0].category,
      "direction": msg[0].geography.direction,
      "latitude": msg[0].geography.latitude,
      "longitude": msg[0].geography.longitude,
      "flightNumber": msg[0].flight.iataNumber,
      "arrival": msg[0].arrival.iataCode,
      "departure": msg[0].departure.iataCode,
      "airline": msg[0].airline.icaoCode
    }

};

return {
    msg: mensajetransformador,
    metadata: metadata,
    msgType: msgType
};