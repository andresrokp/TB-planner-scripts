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