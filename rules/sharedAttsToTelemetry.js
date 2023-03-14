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

function filterForUpdate(){
    return metadata.shared_canUpdate == "true";
}

function stopSaving(){
    return {
        msg: {"canSaveTelemetry":false},
        metadata: {},
        msgType: "POST_ATTRIBUTES_REQUEST"   // attributes befor the save attributes
    };
}

function stopUpdating(){
    return {
        msg: {"canUpdate":false},
        metadata: {},
        msgType: "POST_ATTRIBUTES_REQUEST"
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
                regNum: metadata.shared_regNum,
                echo:"-",
                blockin:"-",
                pushback:"-",
                TT1:"-",
                TT2:"-"
            }
        },
        metadata: metadata,
        msgType: "POST_TELEMETRY_REQUEST"
    }
}

function msgUpdate(){
    return {
        msg: {
            "ts" : metadata.shared_ts_id,
            "values":{
                regNum: metadata.shared_regNum,
                sta: metadata.shared_sta,
                std: metadata.shared_std,
                blockin: metadata.shared_blockin,
                pushback: metadata.shared_pushback,
                echo: metadata.shared_echo,
                TT1: metadata.shared_TT1,
                TT2: metadata.shared_TT2
            }
        },
        metadata: {},
        msgType: "POST_TELEMETRY_REQUEST"
    }
}