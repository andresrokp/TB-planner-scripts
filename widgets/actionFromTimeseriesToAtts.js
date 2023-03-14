let log = console.log

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
            log('telemetry\n',telemetry);
            let attributesArray = []
            for (let key in telemetry){
                attributesArray.push({key:key,value:telemetry[key][0].value})
            }
            log('attributesArray\n',attributesArray);
            updateAttributes(attributesArray)
        }
    )


// Update esa mondá
function updateAttributes(attributesArray){
    attributeService.saveEntityAttributes(entityId, 'SHARED_SCOPE', attributesArray).subscribe(
                    function () {
                        widgetContext.updateAliases();
                        openDashboardState('editar_operacion');
                    }
                );
}

// function to do what it says
function openDashboardState(stateId) {
    let params = {
        entityId: entityId,
        entityName: entityName
    }

    widgetContext.stateController.openState(stateId, params,
        false);
}