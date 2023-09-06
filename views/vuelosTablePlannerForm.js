function entityTable_dataCellContent_logoImgageRender() {
    // cell content function script to insert logos instead of brand names in the atts table

    let url="https://www.sighums.com/wp-content/uploads/2019/01/sighumscenter.png"
    switch (value) {
        case 'AVIANCA':
            url = "https://www.sighums.com/Sig_images_cloud/images_app_menzies/aviancacargo_logo.png"
            break;
        case 'AEROUNION':
            url="https://www.sighums.com/Sig_images_cloud/images_app_menzies/aerounion_logo.png"
            break;
        case 'FEDEX':
            url="https://www.sighums.com/Sig_images_cloud/images_app_menzies/fedex_logo.png"
            break;
        default:
            
    }

    return `<img style="height:25px;" src="${url}"/>`;
}

// ---------
// ---------

function teltryTable_OnRowClick_putRowTeltryIntoAtts(params) {
    let log = console.log
    log('entityId\n',entityId)
    log('entityName\n',entityName)

    //  injector is like an API getter
    let $injector = widgetContext.$scope.$injector;
    // atts API form the injector
    let attributeService = $injector.get(widgetContext
        .servicesMap.get('attributeService'));

    console.log(additionalParams)
    // coger el ts_id
    let ts_id = additionalParams['0']

    // build the msg array de sta, std, blockin, pushback, isClosed, +20
    let keys = ['ts_id','regNum','sta','std','blockin','pushback','echo','TT1','TT2']

    // get la telemetría de ese ts_id -> 
    attributeService.getEntityTimeseries(entityId,keys,ts_id-2,ts_id+2).subscribe(
            function(telemetry){
                
                let attributesData = []
                let attsToDelete = []
                
                for (let key of keys){
                    if(telemetry[key]) attributesData.push({key:key,value:telemetry[key][0].value})
                    else attsToDelete.push({key:key});
                }
                
                updateAttributes(attributesData,attsToDelete)
            }
        )


    // Update esa mondá
    function updateAttributes(attributesData,attsToDelete){
        attributeService.saveEntityAttributes(entityId, 'SHARED_SCOPE', attributesData) //save atts
        .subscribe(
            function () {
                console.log(attsToDelete)
                attributeService.deleteEntityAttributes(entityId, 'SHARED_SCOPE', attsToDelete) //delete atts
                .subscribe(
                    function () {
                        openDashboardState('editar_operacion');
                        widgetContext.updateAliases();
                    }
                )
            }
        );
    }

    // function to do what it says
    function openDashboardState(stateId) {
        let params = { entityId, entityName }
        widgetContext.stateController.openState(stateId, params, false);
    }
}

// ---------
// ---------

function attTable_headerAction_saveNewOperTeltryFromChulito(params) {
    
    // Confirmation alert
    let choose = confirm('Are you sure to save the data?');
    if (!choose) return;

    let $injector = widgetContext.$scope.$injector;
    let attributeService = $injector.get(widgetContext.servicesMap.get('attributeService'));

    // keys to fetch
    let keys = widgetContext.datasources[0].dataKeys.map(dk => dk.name);

    // get SHARED attributes -> 
    attributeService.getEntityAttributes(entityId, 'SHARED_SCOPE', keys).subscribe(
        async function(atts){
            await new Promise(resolve => setTimeout(resolve, 1000)); 
            let nowDate = new Date().getTime();
            
            // join up data pairs Object from loaded atts
            let valuesHash = {};
            for (let keyPkg of atts) valuesHash[keyPkg.key] = keyPkg.value;
            valuesHash.ts_id = nowDate;
            valuesHash.fltNum = entityName;
            
            // adapt to TB expected data structure; 2 properties: a global ts and a sub-oject with all the data pairs
            let telemetryHashArray = [ {key:'ts',value:nowDate}, {key:'values',value:valuesHash} ];
            
            // save esa mondá and wait 2 seconds to update dashboard. TB update the teltry because the ts already existed before
            attributeService.saveEntityTimeseries(entityId, 'ANY', telemetryHashArray)
                            .subscribe(function () { ()=>{setTimeout(widgetContext.updateAliases(),2000) };})
        }
    );
}