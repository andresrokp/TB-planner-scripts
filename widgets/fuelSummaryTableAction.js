console.log('widgetContext',widgetContext)
console.log('startTimeMs', new Date(widgetContext.dashboard.dashboardTimewindow.history.fixedTimewindow.startTimeMs))
console.log('endTimeMs',new Date(widgetContext.dashboard.dashboardTimewindow.history.fixedTimewindow.endTimeMs))


let $injector = widgetContext.$scope.$injector;
let attributeService = $injector.get(widgetContext.servicesMap.get('attributeService'));

let allEntitiesIds = widgetContext.datasources.map(ds => ({'entityType':ds.entityType,'id':ds.entityId}));
let AllEntitiesName = widgetContext.datasources.map(ds => ds.entityName);


// // get fuelConsumption values around TimeWindow interval extremes
// attributeService.getEntityTimeseries(entityId,keys,ts_id-2,ts_id+2).subscribe(
//         function(telemetry){


let testData = [{key:'test-attribute',value:'hola-atributoss'}];

for(let id of allEntitiesIds){
    console.log(id)
    
    //id should be an object {entityType, id}
    attributeService.saveEntityAttributes(id, 'SHARED_SCOPE', testData).subscribe(function(resp){console.log(resp)})
}

// console.log('allEntitiesIds',allEntitiesIds)
// console.log('AllEntitiesNames',AllEntitiesName)


