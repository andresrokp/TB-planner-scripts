


function postProcesingFunctionFuelFilterToAvoidPikes(){
    // comparisson to omit low and higth values
    if (value > 10000 || value < 10 ) return prevValue;
    return value;
}

function cellContentAdvancedGetFuelPercentage(){
    // based on invocation of attributes as table data... then hide the atts columns
    let percentage = ((value-entity.min_fuel)/(entity.max_fuel-entity.min_fuel) * 100).toFixed(1);
    if(percentage > 100) return 100;
    if(percentage < 0) return 0;
    return percentage
}

function cellStyleAdvancedDeltaFuel(){
    if(value > 5000 || value <-5000) return {background:'OrangeRed'}; // sensor errors > bad
    if(value > 100) return {background:'GreenYellow'}; // feel refill > good 1
    if(value > 0) return {background:'LightSalmon'}; // Fake level increas > somewhat bad
    if(value == 0) return {background:'white'}; // Neutral > white
    if(value > -50) return {background:'LightGreen'}; // Normal consumption > good 2
    return {background:'LightSalmon'}; // rare consumption > somewhat bad
}


/*

Objeto Entity

{
    "id": {
        "id": "bbbee290-decb-11ed-9b83-e14509358390",
        "entityType": "DEVICE"
    },
    "entityName": "TT008",
    "entityLabel": "MID-TRACTOR",
    "entityType": "Device",
    "% Combustible": 0,
    "ignition": "true",
    "Operario": 3716402232610710,
    "Label": "MID-TRACTOR",
    "max_fuel": "",
    "min_fuel": "",
    "actionCellButtons": [
        {
            "name": "Route history",
            "icon": "show_chart",
            "type": "openDashboardState",
            "targetDashboardStateId": "route_history",
            "setEntityId": true,
            "stateEntityParamName": null,
            "openInSeparateDialog": true,
            "dialogTitle": "",
            "dialogHideDashboardToolbar": true,
            "dialogWidth": null,
            "dialogHeight": null,
            "openRightLayout": false,
            "id": "0723b92d-aff3-c93d-7348-e794827d5dfb",
            "displayName": "Route history",
            "showActionCellButtonFunction": null,
            "useShowActionCellButtonFunction": false
        },
        {
            "name": "Details",
            "icon": "list",
            "useShowWidgetActionFunction": null,
            "showWidgetActionFunction": "return true;",
            "type": "openDashboardState",
            "targetDashboardStateId": "bus_details",
            "setEntityId": true,
            "stateEntityParamName": null,
            "openRightLayout": false,
            "openInSeparateDialog": false,
            "openInPopover": false,
            "id": "a0446eb2-6e99-ba27-2428-c097c756ea71",
            "displayName": "Details",
            "showActionCellButtonFunction": null,
            "useShowActionCellButtonFunction": false
        }
    ],
    "hasActions": true
}

*/