
//  injector is like an API getter
let $injector = widgetContext.$scope.$injector;
// atts API form the injector
let attributeService = $injector.get(widgetContext
    .servicesMap.get('attributeService'));

console.log(additionalParams)
// build the msg array
let attributesArray = [{key:'regNum',value:additionalParams["1"]}];

// Update esa mondá
attributeService.saveEntityAttributes(entityId, 'SHARED_SCOPE', attributesArray).subscribe(
                    function () {
                        widgetContext.updateAliases();
                        openDashboardState('editar_operacion');
                    }
                );

// function to do what it says
function openDashboardState(stateId) {
    let params = {
        entityId: entityId,
        entityName: entityName
    }

    widgetContext.stateController.openState(stateId, params,
        false);
}