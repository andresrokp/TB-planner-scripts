
//  injector is like an API getter
let $injector = widgetContext.$scope.$injector;
// atts API form the injector
let attributeService = $injector.get(widgetContext
    .servicesMap.get('attributeService'));

// build the msg array
let attributesArray = [{key:'regNum',value:additionalParams["1"]}];

// Update esa mondá
attributeService.saveEntityAttributes(entityId, 'SHARED_SCOPE', attributesArray).subscribe(
                    function () {
                        widgetContext.updateAliases();
                    }
                );