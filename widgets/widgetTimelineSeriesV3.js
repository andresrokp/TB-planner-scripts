
let log = function(obj) {
    console.log(JSON.parse(JSON.stringify(obj)));
}

self.onInit = function() {

    // ctx.data y ctx.datasource are the main data carriers
    log('datasources');
    log(self.ctx.datasources);
    log('data');
    log(self.ctx.data);

    // hash to store the devices names as visJS needs; with id and content
    let turnarounds = self.ctx.datasources.map((e,
    i) => {
        return {
            id: e.name,
            content: e.name
        }
    });

    log('turnarounds');
    log(turnarounds);

    // empty dict to organice the info. It is a Hash of Hashes of arrays. The main key are for device name, the second hash is for the key values {sta:[],std:[],rN:[]}. Inside will be the timeseries values of each
    let mainStore = {};

    if (!self.ctx.data) self.ctx.data = []

    // iterate over [.data] to assembly esa verga with the desired info

    async function stopForArray(e){
        let entityName = e.datasource
            .entityName;
        let dataKey = e.dataKey.name
        await new Promise(resolve => setTimeout(resolve, 100));
        log('e')
        log(e)
        let dataArray = e.data.map((d) => {
            d[1]
        })

        if (!mainStore[entityName]) mainStore[
            entityName] = {};

        mainStore[entityName][dataKey] =
            dataArray
    }

    self.ctx.data.forEach(e => {
        stopForArray(e)
    })

    log('mainStore');
    log(mainStore);

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