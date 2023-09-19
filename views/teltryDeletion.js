function flotHeaderAction() {
    console.log('widgetContext',widgetContext);

    // Los datos que están seleccionados para ocultarse en el widget no reflejan arrays en widgetContext.data, sólo los elementos no seleccionados y con telemetrí existente en el rango de tiempo tienen longitud diferente de 0
    
    let timeseries = [];
    
    widgetContext.data.forEach( dSource => {
        // Toma los data que tienen valores visibles
        if (dSource.data.length > 0){
            // console.log('La tomó : ',dSource.dataKey.name);
            timeseries.push({key:dSource.dataKey.name});
        }
    })
    let endTs = Math.floor(widgetContext.timeWindow.maxTime);
    let startTs = Math.floor(widgetContext.timeWindow.minTime);
    
    console.log(entityId, timeseries, false, startTs, endTs);
    
    widgetContext.attributeService.deleteEntityTimeseries(entityId, timeseries, false, startTs, endTs).subscribe((res)=>{console.log(res)});
    
}