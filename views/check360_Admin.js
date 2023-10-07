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
    // console.log('rowData',rowData);
    // console.log('ctx',ctx);

    let acum = 0;
    let cosas = Object.keys(rowData).length - 5;

    for (let dato in rowData){
        // console.log('dato',dato);
        // console.log('rowData.dato',rowData.dato);
        if ( rowData[dato] == 1.0000001 || rowData[dato] == 1.0000002) {
            acum++;
        }
    }

    // console.log('acum',acum);
    // console.log('cosas',cosas);
    return Math.round(acum / cosas * 100);
}