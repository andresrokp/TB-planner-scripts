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