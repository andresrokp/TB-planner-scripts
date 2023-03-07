function generator(){
    var msg = {};
    var metadata = {};
    var msgType = "POST_TELEMETRY_REQUEST";

    return { msg: msg, metadata: metadata, msgType: msgType };
}

//
// the originator brings regNum, sta, std and canSaveTelemetry
//

function filterScript(){
    return metadata.shared_canSaveTelemetry == "true";
}

function stopSaving(){
    return {
        msg: {"canSaveTelemetry":false},
        metadata: {},
        msgType: "POST_ATTRIBUTES_REQUEST"   // attributes befor the save attributes
    };
}

function telemMsg(){
    var tsid = new Date().getTime()
    return {
        msg: {
            "ts" : tsid,
            "values":{
                ts_id : tsid,
                sta: metadata.shared_sta,
                std: metadata.shared_std,
                regNum: metadata.shared_regNum
            }
        },
        metadata: metadata,
        msgType: "POST_TELEMETRY_REQUEST"  // telemetry before the save telemetry
    }
}