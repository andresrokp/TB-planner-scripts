console.log('widgetContext',widgetContext);

let startTs = widgetContext.dashboard.dashboardTimewindow.history.fixedTimewindow.startTimeMs;
let endTs = widgetContext.dashboard.dashboardTimewindow.history.fixedTimewindow.endTimeMs;
let limit;
let orderBy;
console.log('startTimeMs', new Date(startTs));
console.log('endTimeMs',new Date(endTs));


let $injector = widgetContext.$scope.$injector;
let attributeService = $injector.get(widgetContext.servicesMap.get('attributeService'));
let saveAtts = attributeService.saveEntityAttributes.bind(attributeService);
let getTSeries = attributeService.getEntityTimeseries.bind(attributeService);

let allEntitiesIds = widgetContext.datasources.map(ds => ({'entityType':ds.entityType,'id':ds.entityId}));

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
    limit = 1;
    console.log(entityId)
    getTSeries(entityId, keys, startTs, endTs, limit) //DESC by default
    .subscribe(
        function(superiorValueObj){
            // response has the form {key1:[{ts1,val1},{ts2,val2},...],key2:[...],..}
            let superiorValue = 0;
            if(superiorValueObj.fuel) superiorValue = superiorValueObj.fuel[0].value;
            console.log('superiorValue',superiorValue);
            
            console.log(keys, new Date(startTs), new Date(endTs), limit, orderBy)
            getTSeries(entityId, keys, startTs, endTs, limit, undefined, undefined, 'ASC')
            .subscribe(
                function(inferiorValueObj){
                    console.log('inferiorValueObj',inferiorValueObj);
                    let inferiorValue = 0;
                    if(inferiorValueObj.fuel) inferiorValue = inferiorValueObj.fuel[0].value;
                    console.log('inferiorValue',inferiorValue);
                    let difference = superiorValue - inferiorValue
                    console.log('difference',difference);
                    let data = [{key:'test-attribute',value:difference}];
                    // write the differences en esta mondá!! :)
                    saveAtts(entityId, 'SERVER_SCOPE', data).subscribe(   () => resolve()  );
                })
        })
  });
}