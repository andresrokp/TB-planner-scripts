function buenFecha_fiterNode(params) {
    var today = new Date();
    var currentYear = today.getFullYear();
    
    var fixTime = new Date(msg.position.fixTime);
    var fixTimeYear = fixTime.getFullYear();
    
    return currentYear == fixTimeYear;
}

