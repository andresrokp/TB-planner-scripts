function saveChecklist360Teltry() {
    console.log(widgetContext);

    // Confirmation alert
    let choose = confirm('¿Confirma el guardado de la información?');
    if (!choose) return;
    
    let $injector = widgetContext.$scope.$injector;
    let attributeService = $injector.get(widgetContext.servicesMap.get('attributeService'));
    
    // get all widget's key names
    let keys = widgetContext.datasources[0].dataKeys.map(dk => dk.name);
    console.log('-----------------\nkeys',keys)
    
    // get SHARED attributes
    attributeService.getEntityAttributes(entityId, 'SHARED_SCOPE', keys).subscribe(
        async function(atts){
            
            console.log('loaded atts',atts);
            await new Promise(resolve => setTimeout(resolve, 1000)); 
            
            let valuesHash = {};
            for (let keyPkg of atts){
                // // si la key no es un Simple letrero y el value no existe
                // if (!keyPkg.key.includes('-<') && !keyPkg.value){
                //     alert("ERROR: Hay valores no definidos");
                //     return;
                // }
                valuesHash[keyPkg.key] = keyPkg.value;
            }
            let nowDate = new Date().getTime();
            valuesHash.ts_id = nowDate;
            
            let telemetryHashArray = [ {key:'ts',value:nowDate}, {key:'values',value:valuesHash} ];
            console.log('telemetryHashArray',telemetryHashArray)
            
            // save esa mondá, clear form via att deletion, and wait 1 second to refresh
            attributeService.saveEntityTimeseries(entityId, 'ANY', telemetryHashArray)
            .subscribe( function(resp){
                console.log('resp',resp);
                // // ---------- Clear Form ----------
                // // format keys list as obj array
                // keys = keys.map(k => ({'key':k}));
                // // delete and then refresh
                // attributeService.deleteEntityAttributes(entityId, 'SHARED_SCOPE', keys)
                // .subscribe(function () {
                //     ()=>{setTimeout(widgetContext.updateAliases(),1000)};
                // })
            })
        }
    ); 
}