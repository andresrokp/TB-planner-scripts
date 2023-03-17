
let log = function(msg, obj) {
    console.log(msg, JSON.parse(JSON.stringify(obj)));
}

self.onInit = async function() {
    let startTime = performance.now();
    
    // ctx.data y ctx.datasource are the main data carriers
    console.log('ctx\n', self.ctx);
    log('ctx.datasources\n', self.ctx.datasources);
    log('ctx.data\n',self.ctx.data);
    
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
    log('turnarounds\n',turnarounds);

    // empty hash to organice the info. It is a Hash of Hashes of arrays. The main key are for device name, the second hash is for the key values {sta:[],std:[],rN:[]}. Inside will be the timeseries values of each
    let mainStore = {};
    
    // guard to avoid development joda to save
    if (!data) data = []

    log('my data\n',data);
    // iterate over [.data] to assembly la verga with the desired info
    data.forEach(e => {
        log('e\n',e);
        let entityName = e.datasource.entityName;
        let dataKey = e.dataKey.name;
        let dataArray = e.data.map(d => d[1]);

        if (!mainStore[entityName]) mainStore[entityName] = {};
        mainStore[entityName][dataKey] = dataArray;
    })
    log('mainStore',mainStore);

    // create items
    var groups = new vis.DataSet(turnarounds);
    var items = new vis.DataSet();
    let j = 1;

    for(let device in mainStore){
        log('device\n',device)
        log("mainStore[device]['regNum']",mainStore[device]['regNum'])
        mainStore[device]['regNum'].forEach((e,i)=>{
            log('items e,i\n',`${e},${i}`)
            var start = new Date(mainStore[device]['sta'][i]);
            var end = new Date(mainStore[device]['std'][i]);
            let diffMillis = end - start;
            let diffHours = Math.round((diffMillis / 1000 / 60 / 60) * 10) / 10;
            items.add({
                id: ++j,
                group: device,
                start: start,
                end: end,
                content: `${mainStore[device]['regNum'][i]}::${diffHours}hr`
            });
            log('slot',mainStore[device]['regNum'][i],start,end)
        })
    }

    console.log(items);

    // specify options
    var options = {
        stack: false,
        start: new Date(),
        end: new Date(1000 * 60 * 60 * 48 + (
            new Date()).valueOf()),
        editable: true,
        margin: {
            item: 10, // between items
            axis: 5 // between items and the axis
        },
        orientation: 'top'
    };

    // create a Timeline
    var container = document.getElementById('visualization');
    timeline = new vis.Timeline(container, null, options);
    timeline.setGroups(groups);
    timeline.setItems(items);
    
    log('performance Time\n',performance.now()-startTime)
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