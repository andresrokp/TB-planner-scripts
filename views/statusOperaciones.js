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

    function marker_image(params) {
        // console.log("~~ data", data)
        // console.log("~~ dsData", dsData)
        // console.log("~~ dsIndex", dsIndex)

        let pos;

        if (data.active == 'true')  pos = 18;
        if (data.active == 'false')  pos = 17;
        if (data.emergency == 1)  pos = 16;

        return {
            url: images[pos],
            size: 35
        }
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