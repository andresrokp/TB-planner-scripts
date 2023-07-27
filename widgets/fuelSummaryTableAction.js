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

// empacar la data in TB format
let testData = [{key:'test-attribute',value:'hola-atributos-2'}];

// write the values in device attribute
async function setAllConsumos(){
    for await (let id of allEntitiesIds){ //allEntitiesIds[0],allEntitiesIds[1]]){
        console.log(id)
        //id should be an object {entityType, id}
        const response = await saveEntityAttributesPromise(id,'SHARED_SCOPE',testData);
      console.log(response);
    }
}

// a promise wrapper to enable await for each writing
function saveEntityAttributesPromise(id, scope, data) {
  return new Promise((resolve, reject) => {
    attributeService.saveEntityAttributes(id, scope, data).subscribe(   (response) => resolve(response)  );
  });
}

setAllConsumos()

// console.log('allEntitiesIds',allEntitiesIds)
// console.log('AllEntitiesNames',AllEntitiesName)