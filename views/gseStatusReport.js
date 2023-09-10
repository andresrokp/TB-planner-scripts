function auxDash_simpleCard_settings_widgetCss(params) {
    return{
        "tbDatasource-value":{
            "font-weight":600
        }
    }
}


function auxDash_multAttsUpdate_dataProxMntto_getValue(params) {
    let hrsActuales = ctx.$scope.multipleInputWidget.multipleInputFormGroup.value['3'];
    let hrsToNext = ctx.$scope.multipleInputWidget.multipleInputFormGroup.value['4'];
    
    return hrsActuales + hrsToNext;
}