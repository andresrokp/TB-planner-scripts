function buenFecha_fiterNode(params) {
    var today = new Date();
    var currentYear = today.getFullYear();
    
    var fixTime = new Date(msg.position.fixTime);
    var fixTimeYear = fixTime.getFullYear();
    
    return currentYear == fixTimeYear;
}

function isBLE_filter(params) {
    return !!msg.position.attributes.beacon1Namespace || !!msg.position.attributes.beacon1Uuid ?  true : false;
}

function esBuenMensaje_filter(params) {
    return !!msg.position.attributes.sat && !!msg.position.attributes.sat.io449 ?  msg.position.attributes.sat > 6 : false;
}