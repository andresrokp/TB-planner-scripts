function mainTable_dataEmergency() {
    function cellContent() {
        return value == 1 ? `⚠️ <img style="height:25px;" src="https://media.tenor.com/FKdPTJ5KtbMAAAAC/panic-worried.gif"/> ⚠️` : '........ok........';
    }
}

function mainTable_OnOff() {
    function cellContent() {
        let isActive = entity.active == 'true' ? true : false; //(Date.now() - value) < 20000;

        let url = isActive ? "https://upload.wikimedia.org/wikipedia/commons/c/cf/Toggle_green.png" : "https://upload.wikimedia.org/wikipedia/commons/2/21/Toggle_grey.png";
        
        return `<img style="height:25px;" src="${url}"/>`;
    }    
}

function mainTable_dataHrsToMntto() {
    
    function cellContent() {
        return entity.proxMnttoA - Math.floor(entity["Horom."]/3600);
    }
    
    function cellStyle() {
        let valueCalc = entity.proxMnttoA - Math.floor(entity["Horom."]/3600);
        let style = {}
        
        if (valueCalc < 30) style.color = 'red'
        if (valueCalc < 10) style.fontWeight = 800;
        
        return style;
    }

}

function mainTable_dataName() {
    function cellStyle() {
        return {
            'fontWeight': 900
          }
    }
}

function mainTable_dataUbicacion() {
    function cellContent() {
        if (!value) return '-';
        return JSON.parse(value).join(', ') || 'Ciudad';
    }
}

function mainTable_dataFuelPercentage() {
    let percentage = ((value-entity.min_fuel)/(entity.max_fuel-entity.min_fuel) * 100).toFixed(1);
    if(percentage > 100) return 100;
    if(percentage < 0) return 0;
    return percentage    
}

function mainTable_widgetCssStyle(){
    /*mat-header-row thead font-weight mat-header-cell*/
    return `
        /*celdas de la cabecera*/
        mat-header-cell{
        }
        
        /* table head style to center the titles and set it black and bold ; estilo de la cabcera de la tabla para centrar, poner negros y negrita los títulos */
        .mat-sort-header-container{
            font-weight: 700;
            color: black;
            display: flex; /* Flexbox to center */
            align-items: center; /* Para centrar vertical */
            justify-content: center; /* Para centrar horizontally */
        }
        
        .mat-sort-header-content{
        }
        
        .mat-sort-header-arrow[style*="opacity: 0;"] {
            display: none;
        }
        
        /*Celdas del cuerpo*/
        
        mat-cell{
            text-align: center;
        }    
    `
}