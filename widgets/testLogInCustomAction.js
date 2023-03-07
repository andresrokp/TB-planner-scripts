// script ot log several parameters of an action and some relevant son properties


let log = console.log

log('~ ~ ~ ~ ~\n~ ~ ~ ~ ~')
log('$event ~ ~\n', $event)
log('widgetContext ~ ~\n',widgetContext)
log('entityId ~ ~\n',entityId)
log('entityName ~ ~\n',entityName)
log('additionalParams ~ ~\n',additionalParams)
log('entityLabel ~ ~\n',entityLabel)

let $injector = widgetContext.$scope.$injector;
let attributeService = $injector.get(widgetContext.servicesMap.get('attributeService'));
let attributes = attributeService.getEntityAttributes(entityId, 'SERVER_SCOPE', ['regNum', 'sta','std']).subscribe(function(atts){
        log('ATTS ~ ~\n',atts)
})  // subscribe is almost like .then()

log('$injector ~ ~\n',$injector)
log('attributeService ~ ~\n',attributeService)
log('attributes ~ ~\n',attributes)
