// Confirmation alert
let choose = confirm('Are you sure to save the data?');
if (!choose) return;

let $injector = widgetContext.$scope.$injector;
let attributeService = $injector.get(widgetContext.servicesMap.get('attributeService'));

// get all widget's key names
let keys = widgetContext.datasources[0].dataKeys.map(dk => dk.name);

// get SHARED attributes -> 

attributeService.getEntityAttributes(entityId, 'SERVER_SCOPE', keys).subscribe(
    async function(atts){
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        let nowDate = new Date().getTime();
        
        let valuesHash = {};
        for (let keyPkg of atts) valuesHash[keyPkg.key] = keyPkg.value;
        valuesHash.ts_id = nowDate;
        valuesHash.fltNum = entityName;
        let telemetryHashArray = [ {key:'ts',value:nowDate}, {key:'values',value:valuesHash} ];
        
        // save esa mondá and wait 2 secondss to update dashboard
        attributeService.saveEntityTimeseries(entityId, 'ANY', telemetryHashArray)
                        .subscribe(function () { ()=>{setTimeout(widgetContext.updateAliases(),2000) };})
    }
);