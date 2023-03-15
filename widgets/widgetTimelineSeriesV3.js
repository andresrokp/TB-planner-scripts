
let log = function(msg, obj) {
    console.log(msg, JSON.parse(JSON.stringify(obj)));
}

self.onInit = async function() {
    let startTime = performance.now();
    
    // ctx.data y ctx.datasource are the main data carriers
    console.log('ctx\n', self.ctx);
    log('datasources\n', self.ctx.datasources);
    log('data\n',self.ctx.data);
    
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

    // empty dict to organice the info. It is a Hash of Hashes of arrays. The main key are for device name, the second hash is for the key values {sta:[],std:[],rN:[]}. Inside will be the timeseries values of each
    let mainStore = {};
    
    // guard to avoid development joda to save
    if (!data) data = []

    // iterate over [.data] to assembly esa verga with the desired info
    

    data.forEach(e => {
        // log('e\n',e)|
        let entityName = e.datasource.entityName;
        let dataKey = e.dataKey.name
        let dataArray = e.data.map((d) => {d[1]})

        if (!mainStore[entityName]) mainStore[entityName] = {};
        mainStore[entityName][dataKey] = dataArray
    })

    log('mainStore',mainStore);

    var groups = new vis.DataSet(turnarounds);

    // create items
    var items = new vis.DataSet();

    let deviceList = Object.keys(mainStore);

    // console.log(deviceList);
    let j = 1;

    // TODO change for for..of
    deviceList.forEach(d => {

        //TODO secod loop on each hash element

        // dates generation
        var start = new Date(mainStore[d]
            .sta);
        var end = new Date(mainStore[d].std);
        let diffMillis = end - start;
        let diffHours = Math.round((diffMillis /
            1000 / 60 / 60) * 10) / 10;


        items.add({
            id: ++j,
            group: mainStore[d].name,
            start: start,
            end: end,
            content: `${mainStore[d].regNum}::${diffHours}hr`
        });
    });

    // console.log(items);

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
    var container = document.getElementById(
        'visualization');
    timeline = new vis.Timeline(container, null,
        options);
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