// Confirmation logic
let choose = confirm('Are you sure to save the data?');
if (!choose) return;

// 
let $injector = widgetContext.$scope.$injector;
let attributeService = $injector.get(widgetContext.servicesMap.get('attributeService'));

// keys to fetch
let keys = ['regNum','sta','std'];

// get SHARED attributes -> 
attributeService.getEntityAttributes(entityId, 'SHARED_SCOPE', keys).subscribe(
        async function(atts){
            await new Promise(resolve => setTimeout(resolve, 100)); 
            let nowDate = new Date().getTime();
            
            let valuesHash = {};
            for (let keyPkg of atts) valuesHash[keyPkg.key] = keyPkg.value;
            valuesHash.ts_id = nowDate;
            let telemetryHashArray = [ {key:'ts',value:nowDate} , {key:'values',value:valuesHash} ];
            
            saveTelemetry(telemetryHashArray)
        }
    );


// Update esa mondá
function saveTelemetry(telemetryHashArray){
    attributeService.saveEntityTimeseries(entityId, 'ANY', telemetryHashArray)
                    .subscribe(function () {widgetContext.updateAliases();})
}