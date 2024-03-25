function sateliteMap(params) {
    
    function advanced_labelFunction(params) {
        var active = dsData[dsIndex]['active'];
        var emergency = dsData[dsIndex]['emergency'];
        var color = '#ff2322';
        if (active === "true") color = '#328322';
        if (active === "false") color = '#616161';
        if (emergency === 1) color = '#ff2322';

        return "<div style='position: relative; white-space: nowrap; text-align: center; font-size: 10px; top: 25px;'><span style='margin-left: -500%;'></span><div style='border: solid "+color+"; border-radius: 5px; color: "+color+"; background-color: #fff; '>${entityName}</div><span style='margin-right: -500%;'></span></div>";
    }

    function label_function(params) {
        var active = dsData[dsIndex]['active'];
        var emergency = dsData[dsIndex]['emergency'];
        var color = '#f16362';
        if (active === "true") color = '#328322';
        if (active === "false") color = '#616161';
        if (emergency === 1) color = '#f16362';
        
        return "<div style='position: relative; white-space: nowrap; text-align: center; font-size: 10px; top: 25px;'><span style='margin-left: -500%;'></span><div style='border: solid "+color+"; border-radius: 5px; color: "+color+"; background-color: #fff; '>${entityName}</div><span style='margin-right: -500%;'></span></div>";
    }

    function marker_image(params) {
        // console.log("~~ data", data)
        // console.log("~~ dsData", dsData)
        // console.log("~~ dsIndex", dsIndex)

        let pos;

        if (data.VehicleType == 'LOADER - BELT') pos = 1;
        if (data.active == 'true')  pos += 1;
        if (data.emergency == 1)  pos += 2;

        return {
            url: images[pos],
            size: 35
        }


        /*

        data = {
            "entityName": "287",
            "deviceName": "287",
            "entityId": "c433b380-d1c1-11ee-bf46-f528f0cf9f6e",
            "entityType": "DEVICE",
            "entityLabel": "863719062415618",
            "entityDescription": "",
            "aliasName": "vehicles",
            "dsIndex": 174,
            "dsName": "287",
            "deviceType": null,
            "Vuelo": "",
            "Vuelo|ts": 0,
            "C. Asignado": "",
            "C. Asignado|ts": 0,
            "Conductor": "",
            "Conductor|ts": 0,
            "speed": 0,
            "speed|ts": 1711378999000,
            "fuel": "",
            "fuel|ts": 0,
            "status": "",
            "status|ts": 0,
            "latitude": 4.69893,
            "latitude|ts": 1711378999000,
            "longitude": -74.1460916,
            "longitude|ts": 1711378999000,
            "active": "false",
            "active|ts": 1711379614661,
            "VehicleType": "LOADER - BELT",
            "VehicleType|ts": 1708634064608,
            "emergency": 0,
            "emergency|ts": 1711378995000
        }
        */
    }

}

function aux_dash(params) {

    function mapa_historial_ubicacion(params) {
        
        function tooltip(params) {
            
            return /*
                <b>${entityName}</b>
                <br/>
                <br/><b>Conductor:</b> ${driverName}
                <br/><b>Ubicación:</b> ${geofenceNames}
                <br/><b>Combustible:</b> ${fuel}
                <br/><b>Kilometraje:</b> ${acumuladoDistancia}
                <br/><b>Horómetro:</b> ${horometerAltAdjusted}
                <br/><b>Velocidad:</b> ${speed:1}
                <br/><b>Aceleración:</b> ${resultanteXYZ:1} mg
                <br/><b>Btn Emergencias:</b> ${emergency}
            */
        }
    }
    
}