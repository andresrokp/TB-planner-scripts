
function main_table() {
    
    function action_generateQrCode(params) {


        function mainTable_rowActionButton_generateQRCode() {

            // console.log('widgetContext',widgetContext);
            console.log('additionalParams',additionalParams);
        
            let data = {...additionalParams.entity};
        
            //remove standard values, and only leave the column named values
            delete data.actionCellButtons
            delete data.hasActions
            delete data.entityLabel;
            delete data.entityType;
            delete data.id;
            delete data.entityName;
            let infoPrint = JSON.stringify(data,null,4);
            infoPrint = infoPrint.replaceAll('"','').replace('{','').replace('}','')
        
            // data needed to dash jump
            const estacion = additionalParams.entity['Estación'];
            let infoFetch = encodeURIComponent(JSON.stringify({entityId,entityName,estacion}));
        
            let imgStyles="display: block; margin-left: auto; margin-right: auto;";
        
            widgetContext.dialogs
            .alert('QR Generado',
                `<br><img style="${imgStyles}" src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${infoFetch}">
                <pre>${infoPrint}</pre>`)
            .subscribe();
        }


    }
}





function auxDash_history_actionCell_showPhoto(params) {
    console.log('additionalParams',additionalParams);
    console.log('widgetContext',widgetContext);

    const attsServ = widgetContext.$scope.$injector.get(widgetContext.servicesMap.get('attributeService'));

    const ts = additionalParams[0];

    attsServ.getEntityTimeseries(entityId,['fotografia','comentarios'],ts-2,ts+2)
            .subscribe(function(teltry){
                console.log(teltry);
                const img64 = teltry.fotografia[0].value;
                widgetContext.dialogs.alert('Foto del registro',`<img width="600px" src="${img64}"/>`).subscribe();
            });
}


function auxDash_history_dataCumplimiento(params) {
    let good = 0;
    let bad = 0;

    for (let dato in rowData){
        if ( rowData[dato] === 1) {
            good++;
        }
        if ( rowData[dato] === 0) {
            bad++;
        }
    }

    return Math.round(good / (good+bad) * 100);
}


function resultadosTablita() {

    function cellStyle() {
        if (value === 0) return {color:'red', fontWeight: 600};
        if (value === 1) return {fontWeight: 600};
        return {};
    }
    function cellContent() {
        const valueMap = {
            1:"C",
            0: "NC"
        };
        return valueMap[value] || "NA";
    }
    
}

function auxDash_alarmas_renderDetalles(){
    var noCumpleList = [];

    for (var prop in value){
        if (value[prop] === 0) noCumpleList.push(prop);
    }

    return '<b>-' + noCumpleList.join('<br>-') + '</b>';
}

function aux_dash_reg_table_info_button(params) {
    let pairs = [
        { short: 'Header 1', full: 'Pregunta completa 1' },
        { short: 'Header 2', full: 'Pregunta completa 2' },
        { short: 'Header 3', full: 'Pregunta completa 3' }
      ];
      
      let content = `
        <div style="max-width: 400px; margin: 0 auto;">
          <ul style="list-style: none; padding: 0;">
            ${pairs.map(pair => `<li><strong>${pair.short}:</strong> ${pair.full}</li>`).join('')}
          </ul>
        </div>
      `;
      
      widgetContext.dialogs.alert('Relaciones de Cabeceras', content).subscribe();
}