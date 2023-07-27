console.log('widgetContext',widgetContext);

let startTs = widgetContext.dashboard.dashboardTimewindow.history.fixedTimewindow.startTimeMs;
let endTs = widgetContext.dashboard.dashboardTimewindow.history.fixedTimewindow.endTimeMs;
let limit = 10;
let orderBy = 'DESC'
console.log('startTimeMs', new Date(startTs));
console.log('endTimeMs',new Date(endTs));


let $injector = widgetContext.$scope.$injector;
let attributeService = $injector.get(widgetContext.servicesMap.get('attributeService'));
let saveAtts = attributeService.saveEntityAttributes.bind(attributeService)
let getTSeries = attributeService.getEntityTimeseries.bind(attributeService)

let allEntitiesIds = widgetContext.datasources.map(ds => ({'entityType':ds.entityType,'id':ds.entityId}));
let AllEntitiesName = widgetContext.datasources.map(ds => ds.entityName);

let keys = ['fuel']

// get fuelConsumption values around TimeWindow interval extremes

// empacar la data in TB format
let testData = [{key:'test-attribute',value:'prueba-write-masivo'}];

getCalcSetEachDevice()


/** function definitions **/

// loop over entities and executes processes
async function getCalcSetEachDevice(){
    for await (let id of allEntitiesIds){//[allEntitiesIds[0],allEntitiesIds[1]]){ //
        //id should be an object {entityType, id}
        await entityOperationsChainPromise(id);
    }
}

// a promise wrapper to enable await for each writing
function entityOperationsChainPromise(entityId) {
  return new Promise((resolve,reject) => {
    // get all inferiors
    orderBy = 'DESC';
    // console.log(entityId)
    // console.log(keys, startTs, endTs, limit, orderBy)
    getTSeries(entityId, keys, startTs, endTs, limit, orderBy).subscribe(
        function(superiorValue){            
            console.log(superiorValue)
            resolve()
            // saveAtts(id, 'SERVER_SCOPE', data).subscribe(   () => resolve()  );
        })
    
  });
}