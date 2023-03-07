
// meter la url de vis en 'resources'. A veces se buggea. Darle como 'module' y luego quitarlo

// html ->
// <h2>Timeline SH</h2>
// <div id="visualization"></div>


// El negocio socio
self.onInit = function() {
    
    // console.log(self.ctx.datasources)

    // create groups
    let aviones =  self.ctx.datasources.map( (e,i) => {return {id:e.name,content:e.name}});

    let dataCompacto = {};
    self.ctx.data.forEach( e => {
        if(!dataCompacto[e.datasource.entityName]) dataCompacto[e.datasource.entityName] = {};
        // console.log(e.datasource.entityName,e.dataKey.name);
        // console.log(e.data[0][1]);
        dataCompacto[e.datasource.entityName][e.dataKey.name] = e.data[0][1];
    })

    // console.log(aviones);
    // console.log(dataCompacto);
  
    var groups = new vis.DataSet(aviones);

    // create items
    var items = new vis.DataSet();
  
    let deviceList = Object.keys(dataCompacto);

    // console.log(deviceList);
    let j=1;
    deviceList.forEach( d => {
        var start = new Date(dataCompacto[d].sta);
        var end = new Date(dataCompacto[d].std);
        let diffMillis = end-start;
        let diffHours = Math.round((diffMillis/1000/60/60) * 10) / 10;
          
        items.add({
            id: ++j,
            group: dataCompacto[d].name,
            start: start, // fetch de datos nuestros
            end: end,  // fetch de datos nuestros
            content: `${dataCompacto[d].regNum}::${diffHours}hr`
        });
    });

    // console.log(items);

    // specify options
    var options = {
        stack: false,
        start: new Date(),
        end: new Date(1000*60*60*48 + (new Date()).valueOf()),
        editable: true,
        margin: {
          item: 10, // minimal margin between items
          axis: 5   // minimal margin between items and the axis
        },
        orientation: 'top'
    };

    // create a Timeline
    var container = document.getElementById('visualization');
    timeline = new vis.Timeline(container, null, options);
    timeline.setGroups(groups);
    timeline.setItems(items);
}

self.onDataUpdated = function() {
        
}

self.onResize = function() {
   
}

self.onDestroy = function() {
}
