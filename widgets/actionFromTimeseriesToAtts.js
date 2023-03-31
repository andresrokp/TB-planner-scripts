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