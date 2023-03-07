function generator(){
    var msgType = "POST_TELEMETRY_REQUEST";
    return { 
        msg: {
            "values":{
                "sta":1677547013070,
                "airlineIcao": "MIA",
                "cityIcao":"BOG"
            }
        },
        metadata: {},
        msgType: msgType
    };
}

function saveNewCanFetch(){
    let mensajetransformador = {"canFetch": false}

    return {
        msg: mensajetransformador,
        metadata: {},
        msgType: "POST_ATTRIBUTES_REQUEST"
    }; 
}