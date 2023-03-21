
let log = function(msg, obj) {
    console.log(msg, JSON.parse(JSON.stringify(obj)));
}

self.onInit = async function() {
    let startTime = performance.now();
    
    // ctx.data y ctx.datasource are the main data carriers
    // console.log('ctx\n', self.ctx);
    // log('ctx.datasources\n', self.ctx.datasources);
    // log('ctx.data\n',self.ctx.data);
    
    // corroncho mechanism to wait for data array full load
    await new Promise(resolve => setTimeout(resolve, 100));
    data = [...(self.ctx.data)]
    await new Promise(resolve => setTimeout(resolve, 100));

    // hash to store the devices names as visJS needs; with id and content
    let turnarounds = self.ctx.datasources.map((e,i) => {
        return {
            id: e.name,
            content: e.name
        }
    });
    // log('turnarounds\n',turnarounds);

    // empty hash to organice the info. It is a Hash of Hashes of arrays. The main key are for device name, the second hash is for the key values {sta:[],std:[],rN:[]}. Inside will be the timeseries values of each
    let mainStore = {};
    
    // guard to avoid development joda to save
    if (!data) data = []

    // log('my data\n',data);
    // iterate over [.data] to assembly la verga with the desired info
    data.forEach(e => {
        // log('e\n',e);
        let entityName = e.datasource.entityName;
        let dataKey = e.dataKey.name;
        let dataArray = e.data.map(d => d[1]);

        if (!mainStore[entityName]) mainStore[entityName] = {};
        mainStore[entityName][dataKey] = dataArray;
        mainStore[entityName]['entityId'] = self.ctx.data[0].datasource.entityId;
    })
    // log('mainStore',mainStore);

    // create items
    var groups = new vis.DataSet(turnarounds);
    var items = new vis.DataSet();
    let j = 1;

    for(let device in mainStore){
        // log('device\n',device)
        // log("mainStore[device]['regNum']",mainStore[device]['regNum'])
        let deviceData = mainStore[device]
        deviceData['regNum'].forEach((e,i)=>{
            // log('items e,i\n',`${e},${i}`)
            var start = new Date(deviceData['sta'][i]);
            var end = new Date(deviceData['std'][i]);
            let diffMillis = end - start;
            let diffHours = Math.round((diffMillis / 1000 / 60 / 60) * 10) / 10;
            items.add({
                id: ++j,
                group: device,
                deviceId : deviceData['entityId'],
                start: start,
                end: end,
                regNum: deviceData['regNum'][i],
                ts_id: deviceData['ts_id'][i],
                diffHours: diffHours,
                content: `${deviceData['regNum'][i]}::${diffHours}hr`
            });
            // console.log(e,i,items)
        })
    }

    function formatDateAndTime(aDate) {
        let daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let date = aDate.getDate().toString().padStart(2, '0');
        let dayOfWeek = daysOfWeek[aDate.getDay()];
        let hours = aDate.getHours().toString().padStart(2, '0');
        let minutes = aDate.getMinutes().toString().padStart(2, '0');
        return `${dayOfWeek}${date} @ ${hours}:${minutes}`;
    }
    
    function timeRemaining(futureTime) {
        let now = new Date();
        let timeRemaining = Math.max(0, futureTime - now); // ensure not get negative values
        let hoursRemaining = Math.floor(timeRemaining / (60 * 60 * 1000)); // get hours in whole number
        let minutesRemaining = Math.floor((timeRemaining / (60 * 1000)) % 60); // get minutes, then the reminder quantity
        return `${hoursRemaining} hrs, ${minutesRemaining} min`;
    }
    
    

    // specify options
    var options = {
        stack: false,
        start: new Date(),
        end: new Date(1000 * 60 * 60 * 48 + (new Date()).valueOf()),
        selectable: false,
        editable: false,
        tooltip: {
            template: function(itemData,parsedItemData){
                return `<span><strong>Details</strong></span><br>
                        <span>reg: ${itemData.regNum}</span><br>
                        <span>in: ${timeRemaining(itemData.start)}</span><br>
                        <span>at: ${formatDateAndTime(itemData.start)}</span><br>
                        <span>lasts: ${itemData.diffHours}hr</span>`
            }
        },
        margin: {
            item: 10, // between items
            axis: 5 // between items and the axis
        },
        orientation: 'top'
    };

    // create the Timeline
    var container = document.getElementById('visualization');
    timeline = new vis.Timeline(container, null,options);
    timeline.setGroups(groups);
    timeline.setItems(items);
    
    // helper to 
    function openDashboardState(stateId, deviceId, group) {
        let entityId = {
            "entityType": "DEVICE",
            "id": deviceId
        }
        let params = {
            entityId: entityId,
            entityName: group
        }
        self.ctx.stateController.openState(stateId, params,false);
    }
    
    if (self.ctx.stateController.dashboardId == "c7c456b0-b450-11ed-9b83-e14509358390" && self.ctx.dashboard.authUser.tenantId == "87191010-8d9d-11ea-8896-2dbeb466d642"){
        console.log('hola dashboard pruebas')
        console.log('self\n', self);
        console.log('ctx\n', self.ctx);
        log('my data\n',data);
        log('items\n',items);
        console.log('items async\n',items);
        timeline.on('doubleClick', function(event){
            console.log('ctx.stateController\n',self.ctx.stateController);
            log('props\n',event)
            log('service item\n',event.item)
            let item = items.get(event.item)
            log('real item\n',item)
            log('item ts_id\n',item.ts_id)
            openDashboardState('selected_item',item.deviceId,item.group )
        })
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