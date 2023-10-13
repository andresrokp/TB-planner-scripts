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

}