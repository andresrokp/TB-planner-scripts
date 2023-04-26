var $injector = widgetContext.$scope.$injector;

$injector.get(widgetContext.servicesMap.get('assetService')).getAsset(entityId.id).subscribe(function(asset) 
{
        console.log(asset);
        
        if (asset.name == 'Terminal de Carga') 
		{
            openDashboardState('terminal_de_carga');
        }
        else if(asset.name == 'pareceElTaller') 
		{
            openDashboardState('parece_el_taller');
        }
        else if(asset.name == 'Puente Aereo') 
		{
            openDashboardState('puente_aereo');
        }
        else if(asset.name == 'Terminal Pasajeros Noreste') 
		{
            openDashboardState('terminal_pasajeros_noreste');
        }
        else if(asset.name == 'Terminal Pasajeros Suroeste') 
		{
            openDashboardState('terminal_pasajeros_suroeste');
        }
});

function openDashboardState(stateId) 
{
    var params = 
	{
        entityId: entityId,
        entityName: entityName
    }
    widgetContext.stateController.openState(stateId, params,false);
}