
// >> Still Fails <<
function mainTable_dataiButton2_cellContent(params) {
    const { sourceIndex } = ctx.$scope.timeseriesTableWidget;

    const entityId = ctx.datasources[sourceIndex].entity.id;
    
    const attributeService = ctx.$injector.get(
      ctx.servicesMap.get("attributeService")
    );
    
    // console.log(sourceIndex, entityId, value)
    
    const resp = attributeService.getEntityAttributes(entityId, "SERVER_SCOPE", [value]) /*.subscribe((resp)=>{
        console.log(nombre);
        return nombre;
    }); */
    
    console.log('resp',resp);
    // const nombre = resp[0].value;
    // console.log('nombre',nombre);
    console.log('the end');
    return resp; //new Promise((resolve)=>{ setTimeout(function() {resolve('the end')}, 3000);});
    
    // it is not possible to fetch something because this is a sync function that doesnt wait
    // TODO: checke if i can perform hard changes in the table content. And write the cells directly from the subscribe function    
}