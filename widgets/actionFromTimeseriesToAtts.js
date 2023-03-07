let log = console.log;

log('~ ~ ~ ~ ~\n~ ~ ~ ~ ~');
log('$event ~ ~\n', $event);
log('widgetContext ~ ~\n', widgetContext);
log('entityId ~ ~\n', entityId);
log('entityName ~ ~\n', entityName);
log('additionalParams ~ ~\n', additionalParams);

let $injector = widgetContext.$scope.$injector;
let attributeService = $injector.get(widgetContext
    .servicesMap.get('attributeService'));
let attributes = attributeService.getEntityAttributes(
        entityId, 'SHARED_SCOPE', ['regNum', 'sta', 'std'])
    .subscribe(function(atts) {
        log('ATTS ~ ~\n', atts);
        let attributesArray = [];
        atts.forEach(att => {
            attributesArray.push({
                key: att.key,
                value: att.value
            });
        })
        log('atts array ~ ~\n', attributesArray)
    })