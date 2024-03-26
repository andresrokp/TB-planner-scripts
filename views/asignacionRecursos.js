function table_llavesitas(params) {
    let url;

    if (value == 'EN REVISIÓN') url = 'https://www.sighums.com/menzies/assets/iconos/llave_amarilla.png';
    else if (value == 'OPERATIVO') url = "https://www.sighums.com/menzies/assets/iconos/tractor_verde.png" 
    else url = "https://www.sighums.com/menzies/assets/iconos/llave_roja.png";
    
    return `<img style="height:25px;" src="${url}"/>`;
}