
let log = (msg, obj) => console.log(msg, JSON.parse(JSON.stringify(obj)));

let wait = async (ms) => await new Promise(resolve => setTimeout(resolve, ms));

self.onInit = async function() {
    // ctx.data y ctx.datasource are the main data carriers
    console.log('ctx\n', self.ctx);
    // log('ctx.datasources\n', self.ctx.datasources);
    // log('ctx.data\n',self.ctx.data);
    
    // corroncho mechanism to wait for data array full load
    await wait(100)
    dataCopy = [...(self.ctx.data)] || []
    await wait(100)

    // hash to store the devices names as visJS needs; with id and content
    let turnarounds = self.ctx.datasources.map((e,i) => {
        return {
            id: e.name,
            content: e.name
        }
    });
    // log('turnarounds\n',turnarounds);

    // Empty hash to organice the info.
    // It is a Hash of Hashes of arrays.
    // The main key are for device name
    // the second hash is for the key values {sta:[],std:[],rN:[]}.
    // Inside will be the timeseries values of each key
    let mainStore = {};
    
    // iterate over [.dataCopy] to assembly la verga with the desired info
    dataCopy.forEach(e => {
        // log('e\n',e);
        let { entityName, entityId } = e.datasource;
        let { name : dataKey } = e.dataKey;
        let dataArray = e.data.map(d => d[1]);

        if (!mainStore[entityName]) mainStore[entityName] = {};
        mainStore[entityName][dataKey] = dataArray;
        mainStore[entityName].entityId = entityId;
    });
    // log('mainStore',mainStore);

    // create visJS objects
    const groups = new vis.DataSet(turnarounds);
    const items = new vis.DataSet();
    
    const actualExpectedTest = (self.ctx.dashboard.authUser.userId == "38f40310-2c68-11ed-9e8e-83451eb09aa6"
                            && self.ctx.dashboard.authUser.firstName == "Andres")
                            // && self.ctx.stateController.dashboardId == "3cb087c0-c859-11ed-9b83-e14509358390")
    
    let j = 1;
    // extract the info from mainStore and work with it as is
    for(let [device,deviceData] of Object.entries(mainStore)){
        
        // extract relevant data from the device
        const { regNum,sta,std,ts_id,entityId,blockin,pushback } = deviceData
        for (let i=0; i<regNum.length; i++){
            
            var start = new Date(sta[i]);
            var end = new Date(std[i]);
            let diffMillis = end - start;
            let diffHours = Math.round((diffMillis / 1000 / 60 / 60) * 10) / 10;
            
            items.add({
                id: ++j,
                group: device,
                entityId,
                start,
                end,
                regNum: regNum[i],
                ts_id: ts_id[i],
                diffHours,
                content: `${regNum[i]}::${diffHours}hr`
            });
            
            if (actualExpectedTest && blockin[i] && pushback[i]){
                let operationStart = new Date(blockin[i]);
                let operationEnd = new Date(pushback[i]);
                let operationDiffMillis = operationEnd - operationStart;
                let operationDiffMinutes = Math.round((operationDiffMillis / 1000 / 60 ) * 10) / 10;
                items.add({
                    id: ++j,
                    group: device,
                    className: 'operation',
                    entityId,
                    start: operationStart,
                    end: operationEnd,
                    regNum: regNum[i],
                    ts_id: ts_id[i],
                    diffHours: operationDiffMinutes,
                    content: `${operationDiffMinutes}min`
                });
            }
        }
    }

    function formatDateAndTime(aDate) {
        let daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let date = aDate.getDate().toString().padStart(2, '0'); // rellena el 0
        let dayOfWeek = daysOfWeek[aDate.getDay()];
        let hours = aDate.getHours().toString().padStart(2, '0');
        let minutes = aDate.getMinutes().toString().padStart(2, '0');
        return `${dayOfWeek}${date} @ ${hours}:${minutes}`;
    }
    
    function timeRemaining(futureTime) {
        let now = new Date();
        let timeRemaining = Math.max(0, futureTime - now); // to not take negatives
        let hoursRemaining = Math.floor(timeRemaining / (60 * 60 * 1000)); // get hours in whole number
        let minutesRemaining = Math.floor((timeRemaining / (60 * 1000)) % 60); // get reminder in minutes
        return `${hoursRemaining} hrs, ${minutesRemaining} min`;
    }
    
    // specify visJS options
    var options = {
        stack: true,
        start: new Date(),
        end: new Date(1000 * 60 * 60 * 24 + (new Date()).valueOf()), // one day span
        selectable: false,
        editable: false,
        tooltip: {
            template: function(itemData,parsedItemData){
                return `<b><span>Details</span></b><br>
                        <span>reg: ${itemData.regNum}</span><br>
                        <span>in: ${timeRemaining(itemData.start)}</span><br>
                        <span>at: ${formatDateAndTime(itemData.start)}</span><br>
                        <span>lasts: ${itemData.diffHours}hr</span>`
            }
        },
        margin: {
            item: 3, // between items
            axis: 5 // between items and the axis
        },
        orientation: 'top'
    };

    // create the Timeline
    var container = document.getElementById('visualization');
    timeline = new vis.Timeline(container, null,options);
    timeline.setGroups(groups);
    timeline.setItems(items);
    
    if ( self.ctx.dashboard.authUser.userId == "38f40310-2c68-11ed-9e8e-83451eb09aa6"
    && self.ctx.dashboard.authUser.firstName == "Andres"
    && self.ctx.stateController.dashboardId == "c7c456b0-b450-11ed-9b83-e14509358390"){
        timeline.on('doubleClick', function(event){
            log('event\n',event)
            log('items.get(event.item)\n',items.get(event.item))
            const { entityId,group,ts_id } = items.get(event.item)
            telemetryLoadPushAndGo('selected_item',entityId,group,ts_id )
        })
    }
    
    // BIG function similar to the custom action in the timeseries table of operations in the planner second dashboard state editar_operación
    function telemetryLoadPushAndGo(stateId, _entityId, entityName, ts_id){
        // here we need to put-in this parameters values "manually"
        let entityId = {
            "entityType": "DEVICE",
            "id": _entityId
        }
        let $injector = self.ctx.$scope.$injector;
        let attributeService = $injector.get(self.ctx.servicesMap.get('attributeService'));
        let keys = ['ts_id','regNum','sta','std','blockin','pushback','echo','TT1','TT2']
        
        // get la telemetría de ese ts_id -> 
        attributeService.getEntityTimeseries(entityId,keys,ts_id-2,ts_id+2).subscribe(
            function(telemetry){
                let attributesArray = []
                for (let key in telemetry){
                    attributesArray.push({key:key,value:telemetry[key][0].value})
                }
                updateAttributes(attributesArray)
            }
        )
        
        // Update esa mondá
        function updateAttributes(attributesArray){
            attributeService.saveEntityAttributes(entityId, 'SHARED_SCOPE', attributesArray) 
            .subscribe(
                function () {
                    openDashboardState();
                    self.ctx.updateAliases();
                }
            );
        }
        
        function openDashboardState() {
            let params = { entityId, entityName }
            self.ctx.stateController.openState(stateId,params,false);
        }
    }
}

self.onDataUpdated = function() {

}

self.onLatestDataUpdated = function() {

}

self.onResize = function() {

}

self.onEditModeChanged = function() {

}

self.onDestroy = function() {

}