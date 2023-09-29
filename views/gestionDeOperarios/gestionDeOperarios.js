
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


function mainTable_cellAction_saveRowToCustomer(){
  console.log('widgetContext',widgetContext);
  const confirmacion = confirm('¿Confirmar guardar la información?');
  if (!confirmacion) return;

  console.log('additionalParams',additionalParams);


  console.log("entityId", entityId);
  console.log("additionalParams", additionalParams);
  console.log("widgetContext", widgetContext);

  let $injector = widgetContext.$scope.$injector;
  let entityService = $injector.get(widgetContext.servicesMap.get("entityService"));
  let deviceService = $injector.get(widgetContext.servicesMap.get("deviceService"));
  let attributeService = $injector.get(widgetContext.servicesMap.get("attributeService"));

  const compoundDataKeys = widgetContext.datasources[0].dataKeys
  const dataKeys = compoundDataKeys.map(dk => dk.name);
  console.log("dataKeys", dataKeys);

  let attributesArray = [];

  // traverse the array and build a named array
  dataKeys.forEach( (dk,i) => {
    attributesArray.push({
        key: dk,
        value: additionalParams[i+1], //addPar has 1 element more
      });
  })
  console.log("attributesArray", attributesArray);
          
  // // jala el Device, toma el customerId y guarda copia en él
  deviceService.getDevice(entityId.id).subscribe((resp) => {
          console.log("customerId", resp.customerId);
          
          // attributeService
          //   .saveEntityAttributes(
          //     resp.customerId,
          //     "SERVER_SCOPE",
          //     attributesArray
          //   )
          //   .subscribe();
        });
  //       // Normal thing. Save Device Atts
  //       attributeService.saveEntityAttributes(
  //         entityId,
  //         "SERVER_SCOPE",
  //         attributesArray
  //       );
  //     }
  //   }
  // }

}